/**
 * API Server for Verifier Page
 * 
 * Provides REST endpoints for the frontend to:
 * - List executions
 * - Run new executions
 * - Update human reviews
 * - Get execution details with screenshots
 */

import http from 'http';
import { URL, fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import {
    listExecutions,
    loadExecution,
    updateHumanReview,
    calculateSuccessRate,
    EXECUTIONS_DIR,
} from './execution-store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.API_PORT || 3001;

// CORS headers for frontend access
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

/**
 * Parse JSON body from request
 */
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(e);
            }
        });
    });
}

/**
 * Send JSON response
 */
function sendJson(res, data, status = 200) {
    res.writeHead(status, corsHeaders);
    res.end(JSON.stringify(data));
}

/**
 * Recursively copy a directory
 */
function copyDirSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Handle API requests
 */
async function handleRequest(req, res) {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = url.pathname;

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
    }

    try {
        // GET / - Serve the Verifier UI
        if (pathname === '/' && req.method === 'GET') {
            const htmlPath = path.join(__dirname, 'verifier.html');
            const html = fs.readFileSync(htmlPath, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
            return;
        }
        // GET /api/executions - List all executions
        if (pathname === '/api/executions' && req.method === 'GET') {
            const executions = listExecutions();
            sendJson(res, { executions });
            return;
        }

        // GET /api/executions/:id - Get single execution
        if (pathname.startsWith('/api/executions/') && req.method === 'GET') {
            const id = pathname.split('/').pop();
            const execution = loadExecution(id);
            if (!execution) {
                sendJson(res, { error: 'Execution not found' }, 404);
                return;
            }
            sendJson(res, { execution });
            return;
        }

        // GET /api/executions/:id/screenshots - List screenshots
        if (pathname.match(/^\/api\/executions\/[^/]+\/screenshots$/) && req.method === 'GET') {
            const id = pathname.split('/')[3];
            const screenshotsDir = path.join(EXECUTIONS_DIR, id);

            if (!fs.existsSync(screenshotsDir)) {
                sendJson(res, { screenshots: [] });
                return;
            }

            const files = fs.readdirSync(screenshotsDir)
                .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
                .sort();

            sendJson(res, {
                screenshots: files.map(f => ({
                    name: f,
                    url: `/api/screenshots/${id}/${f}`,
                }))
            });
            return;
        }

        // GET /api/screenshots/:id/:filename - Serve screenshot file
        if (pathname.startsWith('/api/screenshots/') && req.method === 'GET') {
            const parts = pathname.split('/');
            const id = parts[3];
            const filename = parts[4];
            const filePath = path.join(EXECUTIONS_DIR, id, filename);

            if (!fs.existsSync(filePath)) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }

            const ext = path.extname(filename).toLowerCase();
            const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';

            res.writeHead(200, {
                ...corsHeaders,
                'Content-Type': contentType,
            });
            fs.createReadStream(filePath).pipe(res);
            return;
        }

        // GET /report/:executionId/* - Serve per-execution Playwright HTML Report
        if (pathname.match(/^\/report\/\d+/) && req.method === 'GET') {
            const parts = pathname.split('/');
            const executionId = parts[2];
            const subPath = parts.slice(3).join('/') || 'index.html';

            const reportDir = path.join(EXECUTIONS_DIR, executionId, 'playwright-report');
            const filePath = path.join(reportDir, subPath);

            // Security check: ensure path is within reportDir
            const resolvedPath = path.resolve(filePath);
            if (!resolvedPath.startsWith(path.resolve(reportDir))) {
                res.writeHead(403);
                res.end('Forbidden');
                return;
            }

            if (!fs.existsSync(filePath)) {
                res.writeHead(404);
                res.end(`Report not found for execution ${executionId}. The report may not have been generated yet.`);
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.webm': 'video/webm',
                '.webp': 'image/webp',
                '.zip': 'application/zip',
                '.svg': 'image/svg+xml',
                '.ttf': 'font/ttf',
            };
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            res.writeHead(200, {
                ...corsHeaders,
                'Content-Type': contentType,
            });
            fs.createReadStream(filePath).pipe(res);
            return;
        }

        // GET /report/* - Serve global Playwright HTML Report (fallback)
        if (pathname.startsWith('/report') && req.method === 'GET') {
            const reportDir = path.join(process.cwd(), 'playwright-report');
            let filePath;

            if (pathname === '/report' || pathname === '/report/') {
                filePath = path.join(reportDir, 'index.html');
            } else {
                // Serve sub-paths (data/, trace/, trace-attachments/, etc.)
                const subPath = pathname.slice('/report/'.length);
                filePath = path.join(reportDir, subPath);
            }

            // Security check: ensure path is within reportDir
            const resolvedPath = path.resolve(filePath);
            if (!resolvedPath.startsWith(path.resolve(reportDir))) {
                res.writeHead(403);
                res.end('Forbidden');
                return;
            }

            if (!fs.existsSync(filePath)) {
                res.writeHead(404);
                res.end('Report not found. Run tests first with: npx playwright test');
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.webm': 'video/webm',
                '.webp': 'image/webp',
                '.zip': 'application/zip',
                '.svg': 'image/svg+xml',
            };
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            res.writeHead(200, {
                ...corsHeaders,
                'Content-Type': contentType,
            });
            fs.createReadStream(filePath).pipe(res);
            return;
        }

        // GET /api/trace/:id - Serve trace.zip file for Playwright Trace Viewer
        if (pathname.match(/^\/api\/trace\/[^/]+$/) && req.method === 'GET') {
            const id = pathname.split('/').pop();
            const tracePath = path.join(EXECUTIONS_DIR, id, 'trace.zip');

            if (!fs.existsSync(tracePath)) {
                sendJson(res, { error: 'Trace not found', hasTrace: false }, 404);
                return;
            }

            res.writeHead(200, {
                ...corsHeaders,
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="trace-${id}.zip"`,
            });
            fs.createReadStream(tracePath).pipe(res);
            return;
        }

        // GET /api/stats - Get success rate stats
        if (pathname === '/api/stats' && req.method === 'GET') {
            const stats = calculateSuccessRate();
            sendJson(res, { stats });
            return;
        }

        // PUT /api/executions/:id/review - Update human review
        if (pathname.match(/^\/api\/executions\/[^/]+\/review$/) && req.method === 'PUT') {
            const id = pathname.split('/')[3];
            const body = await parseBody(req);

            if (!body.decision || !['pass', 'fail'].includes(body.decision)) {
                sendJson(res, { error: 'Invalid decision. Must be "pass" or "fail"' }, 400);
                return;
            }

            const result = updateHumanReview(id, body);
            sendJson(res, { success: true, execution: result });
            return;
        }

        // POST /api/run - Trigger new execution (runs Playwright test)
        if (pathname === '/api/run' && req.method === 'POST') {
            const body = await parseBody(req);
            const model = body.model || 'mock';
            const executionId = Date.now().toString();

            console.log(`[API] Starting Playwright test execution: ${executionId}`);

            // Create initial execution entry
            const executionDir = path.join(EXECUTIONS_DIR, executionId);
            if (!fs.existsSync(executionDir)) {
                fs.mkdirSync(executionDir, { recursive: true });
            }

            // Create per-execution report directory
            const executionReportDir = path.join(executionDir, 'playwright-report');

            const startTime = new Date().toISOString();
            const initialResult = {
                executionId,
                taskType: 'CREATE_PLAYLIST_ADD_SONG_PLAY',
                model,
                startTime,
                endTime: null,
                verificationResult: null,
                status: 'running',
            };
            fs.writeFileSync(path.join(executionDir, 'result.json'), JSON.stringify(initialResult, null, 2));

            // Run the actual Playwright test with visible browser (--headed)
            // Output report to execution-specific directory
            const { spawn } = await import('child_process');
            const child = spawn('npx', [
                'playwright', 'test', '--headed',
                `--reporter=html`,
                `--output=${path.join(executionDir, 'test-results')}`
            ], {
                cwd: process.cwd(),
                env: {
                    ...process.env,
                    MODEL: model,
                    EXECUTION_ID: executionId,
                    PLAYWRIGHT_HTML_REPORT: executionReportDir,
                },
                stdio: 'inherit',
                shell: true,
            });

            child.on('error', (err) => {
                console.error('[API] Playwright spawn error:', err);
            });

            child.on('close', (code) => {
                console.log(`[API] Playwright test finished with exit code: ${code}`);

                // Update execution result
                const endTime = new Date().toISOString();
                const passed = code === 0;
                const finalResult = {
                    ...initialResult,
                    endTime,
                    status: 'completed',
                    verificationResult: {
                        score: passed ? 1 : 0,
                        passed,
                        details: {
                            playlistCreated: passed,
                            songAdded: passed,
                            playbackStarted: passed,
                        }
                    }
                };
                fs.writeFileSync(path.join(executionDir, 'result.json'), JSON.stringify(finalResult, null, 2));

                // Copy screenshots from test-results to execution directory
                const testResultsDir = path.join(executionDir, 'test-results');
                if (fs.existsSync(testResultsDir)) {
                    const screenshots = fs.readdirSync(testResultsDir).filter(f => f.endsWith('.png'));
                    screenshots.forEach(file => {
                        try {
                            fs.copyFileSync(
                                path.join(testResultsDir, file),
                                path.join(executionDir, file)
                            );
                        } catch (e) {
                            // Ignore copy errors
                        }
                    });
                    console.log(`[API] Copied ${screenshots.length} screenshots to execution ${executionId}`);
                }

                // Also copy from global test-results if execution-specific didn't work
                const globalTestResultsDir = path.join(process.cwd(), 'test-results');
                if (fs.existsSync(globalTestResultsDir)) {
                    const screenshots = fs.readdirSync(globalTestResultsDir).filter(f => f.endsWith('.png'));
                    screenshots.forEach(file => {
                        try {
                            fs.copyFileSync(
                                path.join(globalTestResultsDir, file),
                                path.join(executionDir, file)
                            );
                        } catch (e) {
                            // Ignore copy errors
                        }
                    });
                }

                // Copy global playwright-report to execution directory if per-execution didn't generate
                const globalReportDir = path.join(process.cwd(), 'playwright-report');
                if (!fs.existsSync(executionReportDir) && fs.existsSync(globalReportDir)) {
                    console.log(`[API] Copying global report to execution ${executionId}`);
                    copyDirSync(globalReportDir, executionReportDir);
                }

                console.log(`[API] Execution ${executionId} complete. Report at ${executionReportDir}`);
            });

            sendJson(res, {
                success: true,
                message: 'Playwright test started in headed mode - watch the browser!',
                executionId,
                model,
            });
            return;
        }

        // 404 for unknown endpoints
        sendJson(res, { error: 'Not found' }, 404);

    } catch (error) {
        console.error('[API] Error:', error);
        sendJson(res, { error: error.message }, 500);
    }
}

// Create and start server
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`[API Server] Running on http://localhost:${PORT}`);
    console.log(`[API Server] Executions directory: ${EXECUTIONS_DIR}`);
});
