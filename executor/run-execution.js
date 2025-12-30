/**
 * Execution Runner
 * 
 * Main entry point for running Gemini Computer Use executions.
 */

import { executeAgentLoop } from './action-executor.js';
import { saveExecution, listExecutions, calculateSuccessRate } from './execution-store.js';

/**
 * Run a single execution
 */
export async function runExecution(taskType = 'CREATE_PLAYLIST_ADD_SONG_PLAY') {
    console.log('='.repeat(60));
    console.log(`[ExecutionRunner] Starting Gemini Computer Use execution`);
    console.log(`[ExecutionRunner] Task: ${taskType}`);
    console.log('='.repeat(60));

    const executionId = Date.now().toString();

    try {
        // Run the agent loop
        const result = await executeAgentLoop(taskType, { executionId });

        // Save result
        console.log('\n[ExecutionRunner] Saving result...');
        saveExecution(result);

        // Print summary
        console.log('\n' + '='.repeat(60));
        console.log('[ExecutionRunner] Execution Complete');
        console.log('='.repeat(60));
        console.log(`Execution ID: ${result.executionId}`);
        console.log(`Duration: ${new Date(result.endTime) - new Date(result.startTime)}ms`);
        console.log(`Actions executed: ${result.actions.length}`);
        console.log(`Screenshots: ${result.screenshots.length}`);
        console.log(`Verification Score: ${result.verificationResult?.score ?? 'N/A'}`);
        console.log(`Verification Passed: ${result.verificationResult?.passed ?? 'N/A'}`);

        if (result.verificationResult?.details) {
            console.log('\nVerification Details:');
            console.log(`  - Playlist Created: ${result.verificationResult.details.playlistCreated ? '✅' : '❌'}`);
            console.log(`  - Song Added: ${result.verificationResult.details.songAdded ? '✅' : '❌'}`);
            console.log(`  - Playback Started: ${result.verificationResult.details.playbackStarted ? '✅' : '❌'}`);
        }

        if (result.error) {
            console.log(`\nError: ${result.error}`);
        }

        return result;

    } catch (error) {
        console.error('[ExecutionRunner] Fatal error:', error.message);
        throw error;
    }
}

/**
 * Run multiple executions and calculate success rate
 */
export async function runBatch(count = 5, taskType = 'CREATE_PLAYLIST_ADD_SONG_PLAY') {
    console.log(`[ExecutionRunner] Running batch of ${count} executions...`);

    const results = [];

    for (let i = 0; i < count; i++) {
        console.log(`\n[ExecutionRunner] Batch ${i + 1}/${count}`);
        try {
            const result = await runExecution(taskType);
            results.push(result);
        } catch (error) {
            console.error(`[ExecutionRunner] Batch ${i + 1} failed:`, error.message);
        }

        // Wait between executions
        if (i < count - 1) {
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    // Calculate and print success rate
    const stats = calculateSuccessRate();
    console.log('\n' + '='.repeat(60));
    console.log('[ExecutionRunner] Batch Complete');
    console.log('='.repeat(60));
    console.log(`Total Executions: ${stats.total}`);
    console.log(`Passed: ${stats.passed}`);
    console.log(`Failed: ${stats.failed}`);
    console.log(`Success Rate: ${stats.rate.toFixed(1)}%`);

    return results;
}

/**
 * CLI entry point
 */
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'run';

    switch (command) {
        case 'run':
            await runExecution();
            break;

        case 'batch':
            const count = parseInt(args[1]) || 5;
            await runBatch(count);
            break;

        case 'list':
            const executions = listExecutions();
            console.log('Recent Executions:');
            if (executions.length === 0) {
                console.log('  No executions found.');
            } else {
                executions.slice(0, 10).forEach(e => {
                    const status = e.score === 1 ? '✅' : e.score === 0 ? '❌' : '⏳';
                    console.log(`  ${status} ${e.id}: Score=${e.score ?? 'N/A'}, Human=${e.humanReview?.decision || 'pending'}`);
                });
            }
            break;

        case 'stats':
            const stats = calculateSuccessRate();
            console.log('Execution Statistics:');
            console.log(`  Total: ${stats.total}`);
            console.log(`  Passed: ${stats.passed}`);
            console.log(`  Failed: ${stats.failed}`);
            console.log(`  Success Rate: ${stats.rate.toFixed(1)}%`);
            break;

        default:
            console.log('Usage: node run-execution.js [run|batch|list|stats]');
            console.log('  run           Run a single execution');
            console.log('  batch <count> Run multiple executions');
            console.log('  list          List recent executions');
            console.log('  stats         Show success rate statistics');
    }
}

// Run if called directly
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
