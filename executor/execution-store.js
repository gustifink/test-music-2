/**
 * Execution Store
 * 
 * Manages storing and retrieving execution results.
 */

import fs from 'fs';
import path from 'path';

const EXECUTIONS_DIR = process.env.EXECUTIONS_DIR || './executions';

/**
 * Ensure executions directory exists
 */
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Save execution result
 */
export function saveExecution(result) {
    const executionDir = path.join(EXECUTIONS_DIR, result.executionId);
    ensureDir(executionDir);

    const resultPath = path.join(executionDir, 'result.json');
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));

    console.log(`[ExecutionStore] Saved execution ${result.executionId}`);
    return resultPath;
}

/**
 * Load execution result
 */
export function loadExecution(executionId) {
    const resultPath = path.join(EXECUTIONS_DIR, executionId, 'result.json');
    if (!fs.existsSync(resultPath)) {
        return null;
    }

    return JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
}

/**
 * List all executions
 */
export function listExecutions() {
    ensureDir(EXECUTIONS_DIR);

    const dirs = fs.readdirSync(EXECUTIONS_DIR)
        .filter(name => {
            const stat = fs.statSync(path.join(EXECUTIONS_DIR, name));
            return stat.isDirectory();
        })
        .sort((a, b) => b.localeCompare(a)); // Sort by ID (timestamp) descending

    return dirs.map(id => {
        const result = loadExecution(id);
        if (!result) return null;

        return {
            id,
            startTime: result.startTime,
            endTime: result.endTime,
            score: result.verificationResult?.score ?? null,
            passed: result.verificationResult?.passed ?? false,
            error: result.error,
            humanReview: result.humanReview || null,
        };
    }).filter(Boolean);
}

/**
 * Update execution with human review
 */
export function updateHumanReview(executionId, review) {
    const result = loadExecution(executionId);
    if (!result) {
        throw new Error(`Execution ${executionId} not found`);
    }

    result.humanReview = {
        decision: review.decision, // 'pass' or 'fail'
        notes: review.notes || '',
        timestamp: new Date().toISOString(),
    };

    saveExecution(result);
    return result;
}

/**
 * Calculate success rate
 */
export function calculateSuccessRate() {
    const executions = listExecutions();

    if (executions.length === 0) {
        return { total: 0, passed: 0, failed: 0, rate: 0 };
    }

    const passed = executions.filter(e => e.score === 1).length;
    const failed = executions.filter(e => e.score === 0).length;

    return {
        total: executions.length,
        passed,
        failed,
        rate: (passed / executions.length) * 100,
    };
}

export { EXECUTIONS_DIR };
