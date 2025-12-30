import { useNavigate } from "react-router-dom";
import { libraryData } from "../assets/assets";
import { useContext } from "react";
import { PlayContext } from "../context/PlayContext";
import CreateMenu from "./CreateMenu";

function Sidebar() {
  const navigate = useNavigate();
  const { track, playlists, createPlaylist } = useContext(PlayContext);

  // Combine user playlists with library albums
  const libraryAlbums = libraryData.filter(item => item.type === "Album");
  const allLibraryItems = [...playlists.map(p => ({
    ...p,
    type: "Playlist",
  })), ...libraryAlbums];

  const handleCreatePlaylist = () => {
    const newPlaylist = createPlaylist();
    navigate(`/playlist/${newPlaylist.id}`);
  };

  return (
    <div className="w-80 h-full flex flex-col gap-2 text-white flex-shrink-0 overflow-visible">
      {/* Your Library Section */}
      <div className="bg-spotify-dark rounded-lg flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              role="img"
              height="24"
              width="24"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="#b3b3b3"
              className="hover:fill-white cursor-pointer transition-colors"
            >
              <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z"></path>
            </svg>
            <span className="font-bold text-spotify-text-secondary hover:text-white cursor-pointer transition-colors">Your Library</span>
          </div>
          <div className="flex items-center gap-2">
            <CreateMenu onCreatePlaylist={handleCreatePlaylist} />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-3 flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          <button className="filter-pill filter-pill-active">Playlists</button>
          <button className="filter-pill filter-pill-inactive">Artists</button>
          <button className="filter-pill filter-pill-inactive">Albums</button>
          <button className="filter-pill filter-pill-inactive">Podcasts & Shows</button>
        </div>

        {/* Search and Sort */}
        <div className="px-3 py-2 flex items-center justify-between">
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-spotify-elevated transition-colors">
            <svg
              role="img"
              height="16"
              width="16"
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="#b3b3b3"
            >
              <path d="M7 1.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5zM.25 7a6.75 6.75 0 1 1 12.096 4.12l3.184 3.185a.75.75 0 1 1-1.06 1.06l-3.185-3.184A6.75 6.75 0 0 1 .25 7z"></path>
            </svg>
          </button>
          <button className="flex items-center gap-1 text-sm text-spotify-text-secondary hover:text-white transition-colors">
            Recents
            <svg
              role="img"
              height="16"
              width="16"
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M15 14.5H5V13h10v1.5zm0-5.75H5v-1.5h10v1.5zM15 3H5V1.5h10V3zM3 3H1V1.5h2V3zm0 11.5H1V13h2v1.5zm0-5.75H1v-1.5h2v1.5z"></path>
            </svg>
          </button>
        </div>

        {/* Library Items List */}
        <div className="flex-1 overflow-y-auto px-2 hide-scrollbar hover:show-scrollbar-on-hover">
          {allLibraryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.type === "Playlist") {
                  navigate(`/playlist/${item.id}`);
                } else {
                  navigate(`/album/${item.id % 6}`);
                }
              }}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-spotify-elevated transition-colors ${item.isPlaying ? "bg-spotify-elevated" : ""
                }`}
            >
              {/* Image or music note icon */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-12 h-12 object-cover ${item.type === "Artist" ? "rounded-full" : "rounded"
                    }`}
                />
              ) : (
                <div className="w-12 h-12 bg-spotify-elevated rounded flex items-center justify-center">
                  <svg
                    role="img"
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    fill="#7f7f7f"
                  >
                    <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path>
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${item.isPlaying ? "text-spotify-green" : "text-white"
                  }`}>
                  {item.name}
                </p>
                <p className="text-sm text-spotify-text-secondary truncate">
                  {item.type} • {item.creator}
                </p>
              </div>
              {item.isPlaying && (
                <svg
                  role="img"
                  height="16"
                  width="16"
                  viewBox="0 0 16 16"
                  fill="#1db954"
                >
                  <path d="M10 2v12l-8-6z"></path>
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Now Playing Card at Bottom */}
        <div className="p-2 border-t border-spotify-elevated">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-spotify-elevated">
            <img
              src={track.image}
              alt={track.name}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{track.name}</p>
              <div className="flex items-center gap-1">
                {track.isVerified && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#3b82f6">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
