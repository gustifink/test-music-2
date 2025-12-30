import { createContext, useEffect, useRef, useState } from "react";
import { songsData, libraryData } from "../assets/assets";

export const PlayContext = createContext();

const PlayContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  // Playlist management state
  const [playlists, setPlaylists] = useState(() => {
    // Initialize with some existing playlists from library, pre-populated with songs
    return libraryData
      .filter(item => item.type === "Playlist")
      .map((item, index) => {
        // Pre-populate each playlist with a different subset of songs
        const startIndex = (index * 2) % songsData.length;
        const playlistSongs = songsData.slice(startIndex, startIndex + 4).concat(
          startIndex + 4 > songsData.length ? songsData.slice(0, (startIndex + 4) % songsData.length) : []
        );
        return {
          id: item.id,
          name: item.name,
          creator: item.creator,
          image: item.image,
          songs: playlistSongs,
        };
      });
  });

  const [nextPlaylistNumber, setNextPlaylistNumber] = useState(1);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    song: null,
  });

  const [playlistSubmenu, setPlaylistSubmenu] = useState({
    show: false,
  });

  // Action logging for verification system
  const [actionLog, setActionLog] = useState([]);

  // Action types for verification
  const ACTION_TYPES = {
    PLAYLIST_CREATED: 'PLAYLIST_CREATED',
    SONG_ADDED_TO_PLAYLIST: 'SONG_ADDED_TO_PLAYLIST',
    PLAYBACK_STARTED: 'PLAYBACK_STARTED',
    PLAYBACK_PAUSED: 'PLAYBACK_PAUSED',
  };

  // Log an action for verification
  const logAction = (type, payload) => {
    const action = {
      id: Date.now(),
      type,
      payload,
      timestamp: new Date().toISOString(),
    };
    setActionLog(prev => [...prev, action]);
    console.log('[ActionLog]', action);
  };

  // Clear action log (for new test runs)
  const clearActionLog = () => {
    setActionLog([]);
  };

  // Create a new playlist
  const createPlaylist = () => {
    const newPlaylist = {
      id: `new-${Date.now()}`,
      name: `My Playlist #${nextPlaylistNumber}`,
      creator: "Stanislas Coppin",
      image: null, // Will show music note icon
      songs: [],
      isNew: true,
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
    setNextPlaylistNumber(prev => prev + 1);
    // Log action for verification
    logAction(ACTION_TYPES.PLAYLIST_CREATED, {
      playlistId: newPlaylist.id,
      playlistName: newPlaylist.name,
    });
    return newPlaylist;
  };

  // Add song to playlist
  const addToPlaylist = (playlistId, song) => {
    let songAdded = false;
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        // Check if song already exists
        if (playlist.songs.find(s => s.id === song.id)) {
          return playlist;
        }
        songAdded = true;
        return {
          ...playlist,
          songs: [...playlist.songs, song],
          // Update image if first song
          image: playlist.songs.length === 0 ? song.image : playlist.image,
        };
      }
      return playlist;
    }));
    // Log action for verification (only if song was actually added)
    if (songAdded || !playlists.find(p => p.id === playlistId)?.songs.find(s => s.id === song.id)) {
      logAction(ACTION_TYPES.SONG_ADDED_TO_PLAYLIST, {
        playlistId,
        songId: song.id,
        songName: song.name,
      });
    }
    hideContextMenu();
  };

  // Remove song from playlist
  const removeFromPlaylist = (playlistId, songId) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          songs: playlist.songs.filter(s => s.id !== songId),
        };
      }
      return playlist;
    }));
  };

  // Show context menu
  const showContextMenu = (e, song) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      song,
    });
  };

  // Hide context menu
  const hideContextMenu = () => {
    setContextMenu({
      show: false,
      x: 0,
      y: 0,
      song: null,
    });
    setPlaylistSubmenu({ show: false });
  };

  // Toggle playlist submenu
  const togglePlaylistSubmenu = () => {
    setPlaylistSubmenu(prev => ({ show: !prev.show }));
  };

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setPlayStatus(true);
      }).catch(err => {
        console.error("Play error:", err);
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  // Toggle play/pause - more reliable than separate functions
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (playStatus) {
        audioRef.current.pause();
        setPlayStatus(false);
      } else {
        audioRef.current.play().then(() => {
          setPlayStatus(true);
        }).catch(err => {
          console.error("Play error:", err);
        });
      }
    }
  };

  const plaWithID = async (id) => {
    const song = songsData[id];
    await setTrack(song);
    await audioRef.current.play();
    setPlayStatus(true);
    // Log action for verification
    logAction(ACTION_TYPES.PLAYBACK_STARTED, {
      songId: song.id,
      songName: song.name,
    });
  };

  const previous = async () => {
    if (track.id > 0) {
      await setTrack(songsData[track.id - 1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const next = async () => {
    if (track.id < songsData.length - 1) {
      await setTrack(songsData[track.id + 1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const seekSong = async (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
  };

  useEffect(() => {
    setTimeout(() => {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width =
          Math.floor(
            (audioRef.current.currentTime / audioRef.current.duration) * 100
          ) + "%";

        const currentSeconds = Math.floor(audioRef.current.currentTime % 60);
        const currentMinutes = Math.floor(audioRef.current.currentTime / 60);
        const totalSeconds = Math.floor(audioRef.current.duration % 60);
        const totalMinutes = Math.floor(audioRef.current.duration / 60);

        setTime({
          currentTime: {
            second: currentSeconds.toString().padStart(2, "0"),
            minute: currentMinutes.toString().padStart(2, "0"),
          },
          totalTime: {
            second: totalSeconds.toString().padStart(2, "0"),
            minute: totalMinutes.toString().padStart(2, "0"),
          },
        });
      };
    }, 1000);
  });

  // Click outside to close context menu
  useEffect(() => {
    const handleClick = () => hideContextMenu();
    if (contextMenu.show) {
      document.addEventListener("click", handleClick);
    }
    return () => document.removeEventListener("click", handleClick);
  }, [contextMenu.show]);

  // Expose state to window for external verification (Playwright tests)
  useEffect(() => {
    window.__SPOTIFY_CLONE_STATE__ = {
      actionLog,
      playlists,
      currentTrack: track,
      isPlaying: playStatus,
      getActionLog: () => actionLog,
      clearActionLog,
      // Verify specific task
      verifyTask: (taskType) => {
        switch (taskType) {
          case 'CREATE_PLAYLIST_ADD_SONG_PLAY':
            const hasPlaylistCreated = actionLog.some(a => a.type === 'PLAYLIST_CREATED');
            const hasSongAdded = actionLog.some(a => a.type === 'SONG_ADDED_TO_PLAYLIST');
            const hasPlaybackStarted = actionLog.some(a => a.type === 'PLAYBACK_STARTED');
            return {
              score: (hasPlaylistCreated && hasSongAdded && hasPlaybackStarted) ? 1 : 0,
              passed: hasPlaylistCreated && hasSongAdded && hasPlaybackStarted,
              details: {
                playlistCreated: hasPlaylistCreated,
                songAdded: hasSongAdded,
                playbackStarted: hasPlaybackStarted,
              }
            };
          default:
            return { score: 0, passed: false, details: { error: 'Unknown task type' } };
        }
      }
    };
  }, [actionLog, playlists, track, playStatus]);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    togglePlayPause,
    plaWithID,
    next,
    previous,
    seekSong,
    // Playlist management
    playlists,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    // Context menu
    contextMenu,
    showContextMenu,
    hideContextMenu,
    playlistSubmenu,
    togglePlaylistSubmenu,
    // Action logging (for verification)
    actionLog,
    clearActionLog,
  };

  return (
    <PlayContext.Provider value={contextValue}>
      {props.children}
    </PlayContext.Provider>
  );
};

export default PlayContextProvider;
