import { useContext, useEffect, useState } from "react";
import { PlayContext } from "../context/PlayContext";

const ContextMenu = () => {
    const {
        contextMenu,
        hideContextMenu,
        playlists,
        addToPlaylist,
        playlistSubmenu,
        togglePlaylistSubmenu,
        createPlaylist
    } = useContext(PlayContext);

    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [openToLeft, setOpenToLeft] = useState(false);

    useEffect(() => {
        if (contextMenu.show) {
            // Calculate if menu would overflow viewport
            const menuWidth = 200;
            const submenuWidth = 220;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let x = contextMenu.x;
            let y = contextMenu.y;

            // Check if submenu would overflow to the right
            if (x + menuWidth + submenuWidth > viewportWidth) {
                setOpenToLeft(true);
            } else {
                setOpenToLeft(false);
            }

            // Adjust x if main menu would overflow
            if (x + menuWidth > viewportWidth) {
                x = viewportWidth - menuWidth - 10;
            }

            // Adjust y if menu would overflow bottom
            if (y + 400 > viewportHeight) {
                y = viewportHeight - 400;
            }

            setMenuPosition({ x, y });
        }
    }, [contextMenu.show, contextMenu.x, contextMenu.y]);

    if (!contextMenu.show) return null;

    const handleAddToNewPlaylist = () => {
        const newPlaylist = createPlaylist();
        addToPlaylist(newPlaylist.id, contextMenu.song);
    };

    return (
        <div
            className="fixed z-[100]"
            style={{ left: menuPosition.x, top: menuPosition.y }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-[#282828] rounded-md shadow-2xl py-1 min-w-[200px] text-sm border border-white/10">
                {/* Add to playlist - with submenu */}
                <div className="relative">
                    <button
                        onClick={togglePlaylistSubmenu}
                        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-white/10 transition-colors text-left text-white"
                    >
                        <div className="flex items-center gap-3">
                            <svg
                                role="img"
                                height="16"
                                width="16"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                            >
                                <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path>
                            </svg>
                            Add to playlist
                        </div>
                        <svg
                            role="img"
                            height="16"
                            width="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                        >
                            <path d="M4.97 2.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06L9.44 8 4.97 3.53a.75.75 0 0 1 0-1.06z"></path>
                        </svg>
                    </button>

                    {/* Playlist Submenu */}
                    {playlistSubmenu.show && (
                        <div
                            className={`absolute top-0 bg-[#282828] rounded-md shadow-2xl py-1 min-w-[220px] max-h-80 overflow-y-auto border border-white/10 ${openToLeft ? 'right-full mr-1' : 'left-full ml-1'
                                }`}
                        >
                            {/* Search */}
                            <div className="px-3 py-2">
                                <div className="flex items-center gap-2 bg-[#3e3e3e] rounded px-3 py-1.5">
                                    <svg
                                        role="img"
                                        height="16"
                                        width="16"
                                        viewBox="0 0 16 16"
                                        fill="#b3b3b3"
                                    >
                                        <path d="M7 1.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5zM.25 7a6.75 6.75 0 1 1 12.096 4.12l3.184 3.185a.75.75 0 1 1-1.06 1.06l-3.185-3.184A6.75 6.75 0 0 1 .25 7z"></path>
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Find a playlist"
                                        className="bg-transparent text-sm text-white placeholder-spotify-text-secondary outline-none flex-1"
                                    />
                                </div>
                            </div>

                            {/* New playlist option */}
                            <button
                                onClick={handleAddToNewPlaylist}
                                className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-white"
                            >
                                <svg
                                    role="img"
                                    height="16"
                                    width="16"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path>
                                </svg>
                                New playlist
                            </button>

                            <div className="h-px bg-white/10 my-1"></div>

                            {/* Playlist list */}
                            {playlists.map((playlist) => (
                                <button
                                    key={playlist.id}
                                    onClick={() => addToPlaylist(playlist.id, contextMenu.song)}
                                    className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-white text-sm"
                                >
                                    {playlist.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Save to Liked Songs */}
                <button
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-white"
                >
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2z"></path>
                    </svg>
                    Save to your Liked Songs
                </button>

                {/* Add to queue */}
                <button
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-white"
                >
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zm2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9z"></path>
                    </svg>
                    Add to queue
                </button>

                <div className="h-px bg-white/10 my-1"></div>

                {/* Exclude from taste profile */}
                <button
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-white"
                >
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                        <path d="M3.293 3.293a1 1 0 0 1 1.414 0L8 6.586l3.293-3.293a1 1 0 1 1 1.414 1.414L9.414 8l3.293 3.293a1 1 0 0 1-1.414 1.414L8 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L6.586 8 3.293 4.707a1 1 0 0 1 0-1.414z"></path>
                    </svg>
                    Exclude from your taste profile
                </button>

                <div className="h-px bg-white/10 my-1"></div>

                {/* Go to song radio */}
                <button
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-white"
                >
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                        <path d="M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"></path>
                    </svg>
                    Go to song radio
                </button>

                {/* Go to album */}
                <button
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-white"
                >
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                        <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                    </svg>
                    Go to album
                </button>

                {/* View credits */}
                <button
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-white"
                >
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13zM7 5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-.25 2.5a.75.75 0 0 0 0 1.5h.5v2.5h-.5a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5H9V8.25a.75.75 0 0 0-.75-.75h-1.5z"></path>
                    </svg>
                    View credits
                </button>

                <div className="h-px bg-white/10 my-1"></div>

                {/* Share */}
                <button
                    className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-white/10 transition-colors text-left text-white"
                >
                    <div className="flex items-center gap-3">
                        <svg
                            role="img"
                            height="16"
                            width="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                        >
                            <path d="M1 5.75A.75.75 0 0 1 1.75 5H4v1.5H2.5v8h11v-8H12V5h2.25a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75v-9.5z"></path>
                            <path d="M8 9.576a.75.75 0 0 0 .75-.75V2.903l1.293 1.293a.75.75 0 0 0 1.06-1.06L8.53.563a.75.75 0 0 0-1.06 0L4.897 3.136a.75.75 0 0 0 1.06 1.06L7.25 2.903v5.923c0 .414.336.75.75.75z"></path>
                        </svg>
                        Share
                    </div>
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M4.97 2.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06L9.44 8 4.97 3.53a.75.75 0 0 1 0-1.06z"></path>
                    </svg>
                </button>

                <div className="h-px bg-white/10 my-1"></div>

                {/* Open in Desktop app */}
                <button
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors text-left text-white"
                >
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M6 2.75C6 1.784 6.784 1 7.75 1h6.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15h-6.5A1.75 1.75 0 0 1 6 13.25V2.75zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25h-6.5zm-6 0a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25H4V11H1.75A1.75 1.75 0 0 1 0 9.25v-6.5C0 1.784.784 1 1.75 1H4v1.5H1.75zM4 15H1.75v-1.5H4V15z"></path>
                    </svg>
                    Open in Desktop app
                </button>
            </div>
        </div>
    );
};

export default ContextMenu;
