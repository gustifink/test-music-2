import { useContext } from "react";
import { PlayContext } from "../context/PlayContext";

const Play = () => {
  const {
    track,
    seekBar,
    seekBg,
    playStatus,
    play,
    pause,
    togglePlayPause,
    time,
    previous,
    next,
    seekSong,
  } = useContext(PlayContext);

  return (
    <div className="h-20 bg-black flex items-center justify-between px-4 text-white">
      {/* Left - Track Info */}
      <div className="flex items-center gap-3 w-72 min-w-0">
        <img
          className="w-14 h-14 rounded object-cover"
          src={track.image}
          alt={track.name}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="font-medium truncate text-sm hover:underline cursor-pointer">{track.name}</p>
            {track.isVerified && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1db954">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            )}
          </div>
          <p className="text-xs text-spotify-text-secondary truncate hover:underline cursor-pointer">{track.author}</p>
        </div>
        {/* Add to library button */}
        <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
          <svg
            role="img"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
            <path d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75z"></path>
          </svg>
        </button>
      </div>

      {/* Center - Playback Controls */}
      <div className="flex flex-col items-center gap-1 flex-1 max-w-xl">
        <div className="flex items-center gap-4">
          {/* Shuffle */}
          <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
            <svg
              role="img"
              height="16"
              width="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06l2.306-2.307a.75.75 0 0 0 0-1.06L13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path>
              <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.306 2.306a.75.75 0 0 1 0 1.061l-2.306 2.306a.75.75 0 0 1-1.06-1.06l1.017-1.018H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"></path>
            </svg>
          </button>

          {/* Previous */}
          <button
            onClick={previous}
            className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors"
          >
            <svg
              role="img"
              height="16"
              width="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path>
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {playStatus ? (
              <svg
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
                fill="black"
              >
                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
              </svg>
            ) : (
              <svg
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
                fill="black"
              >
                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={next}
            className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors"
          >
            <svg
              role="img"
              height="16"
              width="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
            </svg>
          </button>

          {/* Repeat */}
          <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
            <svg
              role="img"
              height="16"
              width="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z"></path>
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-spotify-text-secondary w-10 text-right">
            {time.currentTime.minute}:{time.currentTime.second}
          </span>
          <div
            ref={seekBg}
            onClick={seekSong}
            className="flex-1 h-1 bg-white/30 rounded-full cursor-pointer group relative"
          >
            <div
              ref={seekBar}
              className="h-full bg-white rounded-full relative group-hover:bg-spotify-green"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-spotify-text-secondary w-10">
            {time.totalTime.minute}:{time.totalTime.second}
          </span>
        </div>
      </div>

      {/* Right - Extra Controls */}
      <div className="flex items-center gap-2 w-72 justify-end">
        {/* Now playing view */}
        <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
          <svg
            role="img"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M11.196 8 6 5v6l5.196-3z"></path>
            <path d="M15.002 1.75A1.75 1.75 0 0 0 13.252 0h-10.5a1.75 1.75 0 0 0-1.75 1.75v12.5c0 .966.783 1.75 1.75 1.75h10.5a1.75 1.75 0 0 0 1.75-1.75V1.75zm-1.75-.25a.25.25 0 0 1 .25.25v12.5a.25.25 0 0 1-.25.25h-10.5a.25.25 0 0 1-.25-.25V1.75a.25.25 0 0 1 .25-.25h10.5z"></path>
          </svg>
        </button>

        {/* Lyrics */}
        <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
          <svg
            role="img"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M13.426 2.574a2.831 2.831 0 0 0-4.797 1.55l3.247 3.247a2.831 2.831 0 0 0 1.55-4.797zM10.5 8.118l-2.619-2.62A63303.13 63303.13 0 0 0 4.74 9.075L2.065 12.12a1.287 1.287 0 0 0 1.816 1.816l3.06-2.688 3.56-3.129zM7.12 4.094a4.331 4.331 0 1 1 4.786 4.786l-3.974 3.493-3.06 2.689a2.787 2.787 0 0 1-3.933-3.933l2.676-3.045 3.505-3.99z"></path>
          </svg>
        </button>

        {/* Queue */}
        <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
          <svg
            role="img"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zm2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9z"></path>
          </svg>
        </button>

        {/* Device picker */}
        <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
          <svg
            role="img"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M6 2.75C6 1.784 6.784 1 7.75 1h6.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15h-6.5A1.75 1.75 0 0 1 6 13.25V2.75zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25h-6.5zm-6 0a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25H4V11H1.75A1.75 1.75 0 0 1 0 9.25v-6.5C0 1.784.784 1 1.75 1H4v1.5H1.75zM4 15H1.75v-1.5H4V15z"></path>
          </svg>
        </button>

        {/* Volume */}
        <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
          <svg
            role="img"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path>
            <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path>
          </svg>
        </button>

        {/* Volume slider */}
        <div className="w-24 h-1 bg-white/30 rounded-full cursor-pointer group">
          <div className="w-2/3 h-full bg-white rounded-full group-hover:bg-spotify-green relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Full screen */}
        <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
          <svg
            role="img"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M6.53 9.47a.75.75 0 0 1 0 1.06L4.56 12.5h1.94a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 1.5 0v1.94l1.97-1.97a.75.75 0 0 1 1.06 0zm0-2.94L4.56 4.56H6.5a.75.75 0 0 1 0-1.5H3a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0V5.37l1.97 1.97a.75.75 0 0 0 1.06-1.06zm2.94 2.94a.75.75 0 0 1 1.06 0l1.97 1.97v-1.94a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1 0-1.5h1.94l-1.97-1.97a.75.75 0 0 1 0-1.06zm1.06-4.03l1.97-1.97V5.5a.75.75 0 0 0 1.5 0V2a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.94L9.53 4.72a.75.75 0 1 0 1.06 1.06l-.06-.06z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Play;
