/**
 * Verification utility for Spotify Clone AI model testing
 * 
 * This module provides functions to verify if an AI model successfully
 * completed tasks on the Spotify Clone application.
 */

export const TASK_TYPES = {
    CREATE_PLAYLIST_ADD_SONG_PLAY: 'CREATE_PLAYLIST_ADD_SONG_PLAY',
};

export const ACTION_TYPES = {
    PLAYLIST_CREATED: 'PLAYLIST_CREATED',
    SONG_ADDED_TO_PLAYLIST: 'SONG_ADDED_TO_PLAYLIST',
    PLAYBACK_STARTED: 'PLAYBACK_STARTED',
    PLAYBACK_PAUSED: 'PLAYBACK_PAUSED',
};

/**
 * Verify if a specific task was completed based on the action log
 * @param {Array} actionLog - Array of logged actions
 * @param {string} taskType - Type of task to verify
 * @returns {Object} - { score: 0|1, passed: boolean, details: Object }
 */
export function verifyTask(actionLog, taskType) {
    switch (taskType) {
        case TASK_TYPES.CREATE_PLAYLIST_ADD_SONG_PLAY:
            return verifyCreatePlaylistAddSongPlay(actionLog);
        default:
            return {
                score: 0,
                passed: false,
                details: { error: `Unknown task type: ${taskType}` },
            };
    }
}

/**
 * Verify the "Create playlist, add song, play it" task
 */
function verifyCreatePlaylistAddSongPlay(actionLog) {
    const playlistCreatedAction = actionLog.find(a => a.type === ACTION_TYPES.PLAYLIST_CREATED);
    const songAddedAction = actionLog.find(a => a.type === ACTION_TYPES.SONG_ADDED_TO_PLAYLIST);
    const playbackStartedAction = actionLog.find(a => a.type === ACTION_TYPES.PLAYBACK_STARTED);

    const checks = {
        playlistCreated: !!playlistCreatedAction,
        songAdded: !!songAddedAction,
        playbackStarted: !!playbackStartedAction,
    };

    // Verify the song was added to the created playlist
    let songAddedToCorrectPlaylist = false;
    if (playlistCreatedAction && songAddedAction) {
        songAddedToCorrectPlaylist =
            songAddedAction.payload.playlistId === playlistCreatedAction.payload.playlistId;
    }

    const allPassed = checks.playlistCreated && checks.songAdded && checks.playbackStarted;

    return {
        score: allPassed ? 1 : 0,
        passed: allPassed,
        details: {
            ...checks,
            songAddedToCorrectPlaylist,
            timeline: actionLog.map(a => ({
                type: a.type,
                payload: a.payload,
                timestamp: a.timestamp,
            })),
        },
    };
}

/**
 * Generate a human-readable summary of the verification result
 */
export function generateVerificationSummary(result, taskType) {
    const lines = [];
    lines.push(`Task: ${taskType}`);
    lines.push(`Score: ${result.score}`);
    lines.push(`Passed: ${result.passed ? '✅ YES' : '❌ NO'}`);
    lines.push('');
    lines.push('Checks:');

    if (result.details.playlistCreated !== undefined) {
        lines.push(`  - Playlist Created: ${result.details.playlistCreated ? '✅' : '❌'}`);
    }
    if (result.details.songAdded !== undefined) {
        lines.push(`  - Song Added: ${result.details.songAdded ? '✅' : '❌'}`);
    }
    if (result.details.playbackStarted !== undefined) {
        lines.push(`  - Playback Started: ${result.details.playbackStarted ? '✅' : '❌'}`);
    }

    return lines.join('\n');
}
