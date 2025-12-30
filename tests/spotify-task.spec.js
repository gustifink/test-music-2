/**
 * Spotify Clone Task Verification Test
 * 
 * Task: "Create a playlist on the Spotify clone, add a music to it and play it."
 * 
 * Workflow:
 * 1. Create a new playlist (via Create button)
 * 2. Navigate to an existing playlist with tracks (e.g., "December 2025")
 * 3. Click "..." on a track to open context menu
 * 4. Add that track to the newly created playlist
 * 5. Navigate to the new playlist via sidebar
 * 6. Play the song from that playlist
 */

import { test, expect } from '@playwright/test';

test.describe('Spotify Clone Task Verification', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the app
        await page.goto('/');

        // Wait for the app to load
        await page.waitForSelector('text=Your Library');

        // Clear any previous action log
        await page.evaluate(() => {
            if (window.__SPOTIFY_CLONE_STATE__) {
                window.__SPOTIFY_CLONE_STATE__.clearActionLog();
            }
        });
    });

    test('Task: Create playlist, add song from existing playlist, play it', async ({ page }) => {
        // Increase timeout for this test
        test.setTimeout(60000);

        // ========== STEP 1: Create a new playlist ==========
        console.log('Step 1: Creating a new playlist...');
        await page.screenshot({ path: 'test-results/step1-before-create.png' });

        // Click the "Create" button in the sidebar header
        const createButton = page.getByRole('button', { name: /create/i });
        await createButton.click();

        // Wait for dropdown to appear
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'test-results/step1-create-menu.png' });

        // Click "Playlist" option (button name includes description)
        const playlistOption = page.getByRole('button', { name: /playlist.*create a playlist/i });
        await playlistOption.click();

        await page.waitForTimeout(500);
        await page.screenshot({ path: 'test-results/step1-after-create.png' });

        // Get the newly created playlist name
        const actionLogAfterCreate = await page.evaluate(() => {
            return window.__SPOTIFY_CLONE_STATE__.actionLog;
        });
        console.log('After create:', JSON.stringify(actionLogAfterCreate, null, 2));

        const createdPlaylist = actionLogAfterCreate.find(a => a.type === 'PLAYLIST_CREATED');
        const newPlaylistName = createdPlaylist?.payload?.playlistName;
        console.log('Created playlist:', newPlaylistName);

        // ========== STEP 2: Navigate to an existing playlist with tracks ==========
        console.log('Step 2: Navigating to an existing playlist...');

        // Click on an existing playlist in the sidebar (first one with songs)
        const existingPlaylist = page.locator('[class*="cursor-pointer"]').filter({ hasText: 'December 2025' }).first();

        // If December 2025 doesn't exist, try any playlist with "Playlist" in the description
        const playlistLink = await existingPlaylist.count() > 0
            ? existingPlaylist
            : page.locator('[class*="cursor-pointer"]').filter({ hasText: 'Playlist' }).first();

        await playlistLink.click();

        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'test-results/step2-existing-playlist.png' });

        // ========== STEP 3: Click "..." on a track to open context menu ==========
        console.log('Step 3: Opening context menu on a track...');

        // First, hover over a song row to make the "..." button visible
        const songRow = page.locator('[class*="hover:bg-white/10"]').filter({ has: page.locator('img') }).first();
        await songRow.hover();

        await page.waitForTimeout(300);
        await page.screenshot({ path: 'test-results/step3-hover-song.png' });

        // Click the three dots button (more options)
        const moreOptionsButton = songRow.locator('button').filter({ has: page.locator('svg') }).last();
        await moreOptionsButton.click();

        await page.waitForTimeout(500);
        await page.screenshot({ path: 'test-results/step3-context-menu.png' });

        // ========== STEP 4: Add track to the newly created playlist ==========
        console.log('Step 4: Adding track to the new playlist...');

        // Click "Add to playlist"
        const addToPlaylistButton = page.getByRole('button', { name: /add to playlist/i });
        await addToPlaylistButton.click();

        await page.waitForTimeout(500);
        await page.screenshot({ path: 'test-results/step4-playlist-submenu.png' });

        // Click on the newly created playlist (should contain "My Playlist")
        const targetPlaylist = page.locator('button').filter({ hasText: newPlaylistName || 'My Playlist' }).first();
        await targetPlaylist.click();

        await page.waitForTimeout(500);
        await page.screenshot({ path: 'test-results/step4-after-add.png' });

        // Verify song was added
        const actionLogAfterAdd = await page.evaluate(() => {
            return window.__SPOTIFY_CLONE_STATE__.actionLog;
        });
        console.log('After add:', JSON.stringify(actionLogAfterAdd, null, 2));

        // ========== STEP 5: Navigate to the new playlist ==========
        console.log('Step 5: Navigating to the new playlist...');

        // Click on the new playlist in the sidebar
        const newPlaylistLink = page.locator('[class*="cursor-pointer"]').filter({ hasText: newPlaylistName || 'My Playlist' }).first();
        await newPlaylistLink.click();

        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'test-results/step5-new-playlist.png' });

        // ========== STEP 6: Play the song from the new playlist ==========
        console.log('Step 6: Playing the song...');

        // Click on a song row to play it (click the row, not the title)
        const songToPlay = page.locator('[class*="hover:bg-white/10"]').filter({ has: page.locator('img') }).first();
        await songToPlay.click();

        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'test-results/step6-after-play.png' });

        // ========== VERIFICATION ==========
        console.log('Verifying task completion...');

        const verificationResult = await page.evaluate(() => {
            return window.__SPOTIFY_CLONE_STATE__.verifyTask('CREATE_PLAYLIST_ADD_SONG_PLAY');
        });

        console.log('Verification Result:', JSON.stringify(verificationResult, null, 2));

        // Get the full action log for reporting
        const actionLog = await page.evaluate(() => {
            return window.__SPOTIFY_CLONE_STATE__.getActionLog();
        });

        console.log('Full Action Log:', JSON.stringify(actionLog, null, 2));

        // Final screenshot
        await page.screenshot({ path: 'test-results/final-state.png' });

        // Assertions
        expect(verificationResult.passed).toBe(true);
        expect(verificationResult.score).toBe(1);
        expect(verificationResult.details.playlistCreated).toBe(true);
        expect(verificationResult.details.songAdded).toBe(true);
        expect(verificationResult.details.playbackStarted).toBe(true);
    });

    test('Verification fails if playlist not created', async ({ page }) => {
        // Only play a song without creating playlist
        const songItem = page.locator('[class*="bg-white/5"]').first();
        await songItem.click();

        await page.waitForTimeout(1000);

        const verificationResult = await page.evaluate(() => {
            return window.__SPOTIFY_CLONE_STATE__.verifyTask('CREATE_PLAYLIST_ADD_SONG_PLAY');
        });

        expect(verificationResult.passed).toBe(false);
        expect(verificationResult.score).toBe(0);
    });
});
