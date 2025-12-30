import { useState, useRef, useEffect } from "react";

const CreateMenu = ({ onCreatePlaylist, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCreatePlaylist = () => {
        onCreatePlaylist();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-spotify-elevated rounded-full text-sm font-semibold hover:bg-spotify-highlight transition-colors"
            >
                {isOpen ? (
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
                        fill="white"
                    >
                        <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06z"></path>
                    </svg>
                ) : (
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
                        fill="white"
                    >
                        <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path>
                    </svg>
                )}
                Create
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#282828] rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                    {/* Playlist option */}
                    <button
                        onClick={handleCreatePlaylist}
                        className="w-full px-3 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
                    >
                        <div className="w-12 h-12 bg-spotify-elevated rounded flex items-center justify-center">
                            <svg
                                role="img"
                                height="24"
                                width="24"
                                viewBox="0 0 24 24"
                                fill="#b3b3b3"
                            >
                                <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-white">Playlist</p>
                            <p className="text-xs text-spotify-text-secondary">Create a playlist with songs or episodes</p>
                        </div>
                    </button>

                    {/* Blend option */}
                    <button
                        className="w-full px-3 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-400 rounded flex items-center justify-center">
                            <svg
                                role="img"
                                height="24"
                                width="24"
                                viewBox="0 0 24 24"
                                fill="white"
                            >
                                <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"></path>
                                <path d="M12 7.75a1 1 0 0 1 1 1v2.25H15a1 1 0 1 1 0 2h-2v2.25a1 1 0 1 1-2 0V13H9a1 1 0 1 1 0-2h2V8.75a1 1 0 0 1 1-1z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-white">Blend</p>
                            <p className="text-xs text-spotify-text-secondary">Combine your friends' tastes into a playlist</p>
                        </div>
                    </button>

                    {/* Folder option */}
                    <button
                        className="w-full px-3 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
                    >
                        <div className="w-12 h-12 bg-spotify-elevated rounded flex items-center justify-center">
                            <svg
                                role="img"
                                height="24"
                                width="24"
                                viewBox="0 0 24 24"
                                fill="#b3b3b3"
                            >
                                <path d="M1 4a2 2 0 0 1 2-2h5.155a3 3 0 0 1 2.598 1.5l.866 1.5H21a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm7.155 0H3v16h18V7H10.464L9.021 4.5a1 1 0 0 0-.866-.5z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-white">Folder</p>
                            <p className="text-xs text-spotify-text-secondary">Organize your playlists</p>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreateMenu;
