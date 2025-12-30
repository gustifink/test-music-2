/**
 * Action Executor
 * 
 * Executes Gemini Computer Use actions using Playwright.
 * Implements the UI actions from: https://ai.google.dev/gemini-api/docs/computer-use#supported-actions
 */

import { chromium } from 'playwright';
import { createSession, getNextAction, TASK_PROMPTS, SCREEN_WIDTH, SCREEN_HEIGHT, denormalizeX, denormalizeY } from './gemini-client.js';
import fs from 'fs';

/**
 * Execute an agent loop against the Spotify clone
 */
export async function executeAgentLoop(taskType, options = {}) {
    const {
        baseURL = process.env.SPOTIFY_APP_URL || 'http://localhost:5173',
        headless = process.env.HEADLESS === 'true',
        screenshotDir = './executions',
        executionId = Date.now().toString(),
        maxSteps = 15,
    } = options;

    const taskConfig = TASK_PROMPTS[taskType];
    if (!taskConfig) {
        throw new Error(`Unknown task type: ${taskType}`);
    }

    console.log(`[ActionExecutor] Starting agent loop for: ${taskType}`);
    console.log(`[ActionExecutor] Execution ID: ${executionId}`);
    console.log(`[ActionExecutor] Target: ${baseURL}`);
    console.log(`[ActionExecutor] Max steps: ${maxSteps}`);

    // Create execution directory
    const execDir = `${screenshotDir}/${executionId}`;
    if (!fs.existsSync(execDir)) {
        fs.mkdirSync(execDir, { recursive: true });
    }

    const browser = await chromium.launch({ headless });
    const context = await browser.newContext({
        viewport: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
        recordVideo: { dir: execDir },
    });

    // Start trace recording for detailed step-by-step analysis
    await context.tracing.start({ screenshots: true, snapshots: true });

    const page = await context.newPage();

    const results = {
        executionId,
        taskType,
        startTime: new Date().toISOString(),
        actions: [],
        screenshots: [],
        error: null,
        verificationResult: null,
    };

    // Create Gemini session with current URL
    let session = createSession(taskConfig.goal, baseURL);
    let previousActionResult = null;

    try {
        // Navigate to the app
        console.log('[ActionExecutor] Navigating to app...');
        await page.goto(baseURL);
        await page.waitForSelector('text=Your Library', { timeout: 30000 });

        // Update session URL
        session.currentUrl = page.url();

        // Clear action log
        await page.evaluate(() => {
            if (window.__SPOTIFY_CLONE_STATE__) {
                window.__SPOTIFY_CLONE_STATE__.clearActionLog();
            }
        });

        // Agent loop
        for (let step = 0; step < maxSteps; step++) {
            console.log(`\n[ActionExecutor] === Step ${step + 1}/${maxSteps} ===`);

            // Take screenshot (JPEG with compression to reduce API token usage)
            const screenshotPath = `${execDir}/step${step}.jpg`;
            await page.screenshot({ path: screenshotPath, type: 'jpeg', quality: 60 });
            results.screenshots.push(screenshotPath);

            // Get next action from Gemini
            const result = await getNextAction(session, screenshotPath, previousActionResult);
            const action = result.action;
            session = result.session;

            // Update current URL
            session.currentUrl = page.url();

            if (action.name === 'done') {
                console.log('[ActionExecutor] Task marked as complete by model');
                break;
            }

            // Record action
            const stepResult = {
                step: step + 1,
                action: action.name,
                args: action.args,
                reasoning: action.reasoning,
                success: false,
                error: null,
            };

            // Execute action
            try {
                await executeAction(page, action);
                stepResult.success = true;
                console.log(`[ActionExecutor] Step ${step + 1} completed: ${action.name}`);
            } catch (error) {
                stepResult.error = error.message;
                console.error(`[ActionExecutor] Step ${step + 1} failed:`, error.message);
            }

            results.actions.push(stepResult);

            // Store result for next iteration (include error if any)
            previousActionResult = {
                name: action.name,
                success: stepResult.success,
                error: stepResult.error
            };

            // Update URL after action
            session.currentUrl = page.url();

            // Wait for page to stabilize
            try {
                await page.waitForLoadState('networkidle', { timeout: 3000 });
            } catch {
                // Ignore timeout, not all actions trigger navigation
            }
            await page.waitForTimeout(500);
        }

        // Verify the task
        console.log('\n[ActionExecutor] Verifying task...');
        results.verificationResult = await page.evaluate(() => {
            return window.__SPOTIFY_CLONE_STATE__?.verifyTask('CREATE_PLAYLIST_ADD_SONG_PLAY');
        });

        // Get action log
        results.actionLog = await page.evaluate(() => {
            return window.__SPOTIFY_CLONE_STATE__?.getActionLog();
        });

        // Final screenshot
        const finalScreenshot = `${execDir}/final.jpg`;
        await page.screenshot({ path: finalScreenshot, type: 'jpeg', quality: 60 });
        results.screenshots.push(finalScreenshot);

    } catch (error) {
        results.error = error.message;
        console.error('[ActionExecutor] Execution error:', error.message);
    } finally {
        results.endTime = new Date().toISOString();

        // Save trace file for Playwright Trace Viewer
        const tracePath = `${execDir}/trace.zip`;
        try {
            await context.tracing.stop({ path: tracePath });
            results.tracePath = tracePath;
            console.log(`[ActionExecutor] Trace saved: ${tracePath}`);
        } catch (e) {
            console.error('[ActionExecutor] Failed to save trace:', e.message);
        }

        await context.close();
        await browser.close();
    }

    return results;
}

/**
 * Execute a single Computer Use action
 * Note: Coordinates from Gemini are in 0-1000 range and need denormalization
 */
async function executeAction(page, action) {
    const { name, args } = action;

    // Denormalize coordinates if present
    const x = args.x !== undefined ? denormalizeX(args.x) : undefined;
    const y = args.y !== undefined ? denormalizeY(args.y) : undefined;

    switch (name) {
        case 'open_web_browser':
            // Already in browser, no-op
            break;

        case 'navigate':
            await page.goto(args.url);
            break;

        case 'click_at':
            console.log(`[ActionExecutor] Clicking at (${x}, ${y})`);
            await page.mouse.click(x, y);
            break;

        case 'hover_at':
            console.log(`[ActionExecutor] Hovering at (${x}, ${y})`);
            await page.mouse.move(x, y);
            break;

        case 'type_text_at':
            console.log(`[ActionExecutor] Typing at (${x}, ${y}): "${args.text}"`);
            // Click first to focus
            await page.mouse.click(x, y);
            await page.waitForTimeout(100);

            // Clear if needed
            if (args.clear_before_typing) {
                await page.keyboard.press('Meta+a');
                await page.keyboard.press('Backspace');
            }

            // Type text
            await page.keyboard.type(args.text);

            // Press enter if requested
            if (args.press_enter) {
                await page.keyboard.press('Enter');
            }
            break;

        case 'key_combination':
            await page.keyboard.press(args.keys);
            break;

        case 'scroll_document':
        case 'scroll_at':
            const direction = args.direction || 'down';
            const magnitude = args.magnitude || 300;

            if (x !== undefined && y !== undefined) {
                await page.mouse.move(x, y);
            }

            await page.mouse.wheel(
                0,
                direction === 'up' ? -magnitude : magnitude
            );
            break;

        case 'drag_and_drop':
            const destX = denormalizeX(args.destination_x);
            const destY = denormalizeY(args.destination_y);
            await page.mouse.move(x, y);
            await page.mouse.down();
            await page.mouse.move(destX, destY);
            await page.mouse.up();
            break;

        case 'go_back':
            await page.goBack();
            break;

        case 'go_forward':
            await page.goForward();
            break;

        case 'wait_5_seconds':
            await page.waitForTimeout(5000);
            break;

        case 'search':
            await page.keyboard.press('Meta+f');
            break;

        default:
            console.warn(`[ActionExecutor] Unknown action: ${name}`);
    }
}

// Export legacy function for compatibility
export { executeAgentLoop as executeActions };
