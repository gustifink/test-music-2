/**
 * Gemini Computer Use Client
 * 
 * Uses Gemini's Computer Use API to control browser via screenshots.
 * Ref: https://ai.google.dev/gemini-api/docs/computer-use
 */

import fs from 'fs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-computer-use-preview-10-2025:generateContent';

// Screen dimensions (recommended by Google)
export const SCREEN_WIDTH = 1440;
export const SCREEN_HEIGHT = 900;

/**
 * Denormalize coordinates from 0-1000 range to actual pixels
 */
export function denormalizeX(x, screenWidth = SCREEN_WIDTH) {
    return Math.round((x / 1000) * screenWidth);
}

export function denormalizeY(y, screenHeight = SCREEN_HEIGHT) {
    return Math.round((y / 1000) * screenHeight);
}

/**
 * Task prompts configuration
 */
export const TASK_PROMPTS = {
    CREATE_PLAYLIST_ADD_SONG_PLAY: {
        goal: `Create a playlist on the Spotify clone, add a music to it and play it.

Steps to complete:
1. Click the "Create" button in the sidebar
2. Click "Playlist" option from the dropdown menu  
3. Click on "December 2025" playlist in the sidebar to see its tracks
4. Hover over a song row and click the "..." button to open the context menu
5. Click "Add to playlist" in the context menu
6. Select the newly created "My Playlist #1" from the submenu
7. Click on "My Playlist #1" in the sidebar to navigate to it
8. Click on a song row to play it`
    }
};

/**
 * Create a Gemini Computer Use session
 */
export function createSession(goal, currentUrl) {
    return {
        goal,
        currentUrl,
        contents: [],
        isInitialized: false,
    };
}

/**
 * Get next action from Gemini Computer Use
 * @param {Object} session - The session object
 * @param {string} screenshotPath - Path to current screenshot
 * @param {Object} previousActionResult - Result of previous action (for function response)
 * @returns {Object} - { action, session }
 */
export async function getNextAction(session, screenshotPath, previousActionResult = null) {
    if (!GEMINI_API_KEY) {
        console.log('[GeminiClient] No API key, using mock action');
        return { action: getMockAction(session.contents.length), session };
    }

    try {
        // Read screenshot as base64 and detect mime type
        const screenshotBuffer = fs.readFileSync(screenshotPath);
        const screenshotBase64 = screenshotBuffer.toString('base64');
        const mimeType = screenshotPath.endsWith('.jpg') || screenshotPath.endsWith('.jpeg')
            ? 'image/jpeg'
            : 'image/png';

        // Log screenshot size for monitoring
        const sizeKB = Math.round(screenshotBuffer.length / 1024);
        console.log(`[GeminiClient] Screenshot size: ${sizeKB} KB (${mimeType})`);

        // First turn: add user message with goal + screenshot
        if (!session.isInitialized) {
            session.contents.push({
                role: 'user',
                parts: [
                    { text: session.goal },
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: screenshotBase64
                        }
                    }
                ]
            });
            session.isInitialized = true;
        } else if (previousActionResult) {
            // Build function response with URL (required by Computer Use API)
            // Format based on Google's Python SDK example
            session.contents.push({
                role: 'user',
                parts: [
                    {
                        functionResponse: {
                            name: previousActionResult.name,
                            response: {
                                url: session.currentUrl,  // REQUIRED: must be "url" not "current_url"
                                result: previousActionResult.success ? 'success' : 'error',
                                error: previousActionResult.error || null
                            }
                        }
                    },
                    // Screenshot as separate part after function response
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: screenshotBase64
                        }
                    }
                ]
            });
        }

        console.log('[GeminiClient] Calling Gemini Computer Use API...');

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: session.contents,
                tools: [{
                    computerUse: {
                        environment: 'ENVIRONMENT_BROWSER'
                    }
                }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 2048,
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('[GeminiClient] API error:', JSON.stringify(data.error, null, 2));
            throw new Error(data.error.message || 'API error');
        }

        // Get the model's response
        const candidate = data.candidates?.[0];
        if (!candidate?.content?.parts) {
            console.error('[GeminiClient] No content in response');
            throw new Error('No content in response');
        }

        // Add model response to history
        session.contents.push(candidate.content);

        // Extract function call and text
        const parts = candidate.content.parts;
        const textPart = parts.find(p => p.text);
        const functionCallPart = parts.find(p => p.functionCall);

        if (textPart?.text) {
            const preview = textPart.text.substring(0, 100);
            console.log('[GeminiClient] Model:', preview + (textPart.text.length > 100 ? '...' : ''));
        }

        if (functionCallPart) {
            const action = {
                name: functionCallPart.functionCall.name,
                args: functionCallPart.functionCall.args || {},
                reasoning: textPart?.text || ''
            };
            console.log('[GeminiClient] Action:', action.name, JSON.stringify(action.args));
            return { action, session };
        }

        // No function call = task complete
        console.log('[GeminiClient] No action, task may be complete');
        return {
            action: { name: 'done', args: {}, reasoning: textPart?.text || 'Task complete' },
            session
        };

    } catch (error) {
        console.error('[GeminiClient] Error:', error.message);
        return { action: getMockAction(session.contents.length), session };
    }
}

/**
 * Mock actions for testing without API key
 * Coordinates are in 0-1000 normalized range (will be denormalized to 1440x900)
 * Based on actual Spotify Clone UI layout observed:
 * - Create button: (164, 109)
 * - Playlist dropdown option: (215, 181)
 * - December 2025 playlist: (122, 274)
 * - Song rows in main content: (500, 482) onwards
 */
function getMockAction(step) {
    const mockActions = [
        // Step 0: Click "Create" button in sidebar
        { name: 'click_at', args: { x: 164, y: 109 }, reasoning: 'Click Create button in sidebar' },

        // Step 1: Wait for dropdown to appear
        { name: 'wait_5_seconds', args: {}, reasoning: 'Wait for dropdown menu to appear' },

        // Step 2: Click "Playlist" option in dropdown
        { name: 'click_at', args: { x: 215, y: 181 }, reasoning: 'Click Playlist option in dropdown' },

        // Step 3: Wait for playlist creation
        { name: 'wait_5_seconds', args: {}, reasoning: 'Wait for new playlist to be created' },

        // Step 4: Click on "December 2025" playlist in sidebar
        { name: 'click_at', args: { x: 122, y: 274 }, reasoning: 'Click on December 2025 playlist in library' },

        // Step 5: Wait for playlist to load
        { name: 'wait_5_seconds', args: {}, reasoning: 'Wait for playlist content to load' },

        // Step 6: Hover over first song row to reveal options
        { name: 'hover_at', args: { x: 500, y: 482 }, reasoning: 'Hover over first song row to reveal options' },

        // Step 7: Click the "..." more options button on song row (right side of row)
        { name: 'click_at', args: { x: 700, y: 482 }, reasoning: 'Click more options (...) button on song row' },

        // Step 8: Wait for context menu
        { name: 'wait_5_seconds', args: {}, reasoning: 'Wait for context menu to appear' },

        // Step 9: Click "Add to playlist" in context menu
        { name: 'click_at', args: { x: 720, y: 520 }, reasoning: 'Click Add to playlist option' },

        // Step 10: Wait for submenu
        { name: 'wait_5_seconds', args: {}, reasoning: 'Wait for playlist submenu to appear' },

        // Step 11: Select "My Playlist #1" from submenu
        { name: 'click_at', args: { x: 850, y: 520 }, reasoning: 'Select My Playlist #1 from submenu' },

        // Step 12: Click on "My Playlist #1" in sidebar to navigate to it (above December 2025)
        { name: 'click_at', args: { x: 122, y: 230 }, reasoning: 'Navigate to My Playlist #1 in sidebar' },

        // Step 13: Wait for playlist to load
        { name: 'wait_5_seconds', args: {}, reasoning: 'Wait for new playlist to load' },

        // Step 14: Click on song row to play
        { name: 'click_at', args: { x: 500, y: 482 }, reasoning: 'Click on song row to play' },

        // Step 15: Done
        { name: 'done', args: {}, reasoning: 'Task complete - playlist created, song added and played' },
    ];

    return mockActions[Math.min(step, mockActions.length - 1)];
}

