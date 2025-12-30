import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { PlayContext } from "../context/PlayContext";
import { songsData } from "../assets/assets";

const PlaylistPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { playlists, plaWithID, showContextMenu, addToPlaylist } = useContext(PlayContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Find the playlist (URL param is string, but playlist IDs can be numbers)
    const playlist = playlists.find(p => String(p.id) === id || p.id === id || p.id === `new-${id}`);

    if (!playlist) {
        return <div className="p-8 text-white">Playlist not found</div>;
    }

    // Handle search
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            const results = songsData.filter(song =>
                song.name.toLowerCase().includes(query.toLowerCase()) ||
                song.author.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    return (
        <div className="p-4">
            {/* Playlist Header */}
            <div className="flex items-end gap-6 mb-8 mt-4">
                {/* Playlist Cover */}
                <div className="w-48 h-48 bg-spotify-elevated rounded shadow-2xl flex items-center justify-center">
                    {playlist.image ? (
                        <img
                            src={playlist.image}
                            alt={playlist.name}
                            className="w-full h-full object-cover rounded"
                        />
                    ) : (
                        <svg
                            role="img"
                            height="64"
                            width="64"
                            viewBox="0 0 24 24"
                            fill="#7f7f7f"
                        >
                            <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path>
                        </svg>
                    )}
                </div>

                {/* Playlist Info */}
                <div className="flex flex-col">
                    <span className="text-sm font-medium">Public Playlist</span>
                    <h1 className="text-5xl font-bold mt-2 mb-4">{playlist.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-spotify-text-secondary">
                        <div className="w-6 h-6 rounded-full bg-spotify-green flex items-center justify-center text-xs font-bold text-black">
                            S
                        </div>
                        <span className="font-semibold text-white">{playlist.creator}</span>
                        {playlist.songs.length > 0 && (
                            <>
                                <span>•</span>
                                <span>{playlist.songs.length} songs</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-6">
                <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
                    <svg
                        role="img"
                        height="24"
                        width="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"></path>
                        <path d="M17.999 12a6 6 0 0 0-12 0h2a4 4 0 0 1 8 0h2z"></path>
                    </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
                    <svg
                        role="img"
                        height="24"
                        width="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                    </svg>
                </button>
                <div className="flex-1"></div>
                <button className="flex items-center gap-1 text-sm text-spotify-text-secondary hover:text-white transition-colors">
                    List
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M15 14.5H5V13h10v1.5zm0-5.75H5v-1.5h10v1.5zM15 3H5V1.5h10V3zM3 3H1V1.5h2V3zm0 11.5H1V13h2v1.5zm0-5.75H1v-1.5h2v1.5z"></path>
                    </svg>
                </button>
            </div>

            {/* Playlist Songs */}
            {playlist.songs.length > 0 ? (
                <>
                    {/* Song List Header */}
                    <div className="grid grid-cols-[16px_4fr_1fr] gap-4 px-4 py-2 text-spotify-text-secondary text-sm border-b border-white/10 mb-2">
                        <span>#</span>
                        <span>Title</span>
                        <span className="flex justify-end">
                            <svg
                                role="img"
                                height="16"
                                width="16"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                            >
                                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                                <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"></path>
                            </svg>
                        </span>
                    </div>

                    {/* Songs */}
                    {playlist.songs.map((song, index) => (
                        <div
                            key={song.id}
                            onClick={() => plaWithID(song.id)}
                            onContextMenu={(e) => showContextMenu(e, song)}
                            className="grid grid-cols-[16px_4fr_1fr_auto] gap-4 px-4 py-2 items-center text-spotify-text-secondary hover:bg-white/10 rounded-md cursor-pointer group"
                        >
                            <span className="group-hover:hidden">{index + 1}</span>
                            <svg
                                className="hidden group-hover:block"
                                role="img"
                                height="16"
                                width="16"
                                viewBox="0 0 16 16"
                                fill="white"
                            >
                                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                            </svg>
                            <div className="flex items-center gap-3 min-w-0">
                                <img
                                    className="w-10 h-10 rounded object-cover"
                                    src={song.image}
                                    alt={song.name}
                                />
                                <div className="min-w-0">
                                    <p
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/song/${song.id}`);
                                        }}
                                        className="text-white font-medium truncate hover:underline cursor-pointer"
                                    >
                                        {song.name}
                                    </p>
                                    <p className="text-sm truncate">{song.author}</p>
                                </div>
                            </div>
                            <p className="text-sm text-right">{song.duration}</p>
                            {/* More options button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showContextMenu(e, song);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg
                                    role="img"
                                    height="16"
                                    width="16"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                                </svg>
                            </button>
                        </div>
                    ))}
                </>
            ) : null}

            {/* Search Section - Only show for newly created playlists */}
            {playlist.isNew && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Let's find something for your playlist</h2>
                    <div className="relative max-w-md">
                        <div className="flex items-center bg-spotify-elevated rounded px-4 py-2">
                            <svg
                                role="img"
                                height="20"
                                width="20"
                                viewBox="0 0 24 24"
                                fill="#b3b3b3"
                                className="mr-3"
                            >
                                <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search for songs or episodes"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="bg-transparent flex-1 outline-none text-white placeholder-spotify-text-secondary text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                                    className="text-spotify-text-secondary hover:text-white"
                                >
                                    <svg
                                        role="img"
                                        height="20"
                                        width="20"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                    >
                                        <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06z"></path>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="mt-4">
                            {searchResults.map((song) => (
                                <div
                                    key={song.id}
                                    className="flex items-center justify-between p-2 rounded-md hover:bg-white/10 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={song.image}
                                            alt={song.name}
                                            className="w-10 h-10 rounded object-cover"
                                        />
                                        <div>
                                            <p className="text-white font-medium">{song.name}</p>
                                            <p className="text-sm text-spotify-text-secondary">{song.author}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addToPlaylist(playlist.id, song)}
                                        className="px-4 py-1.5 border border-spotify-text-subdued rounded-full text-sm font-semibold text-white hover:border-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlaylistPage;
