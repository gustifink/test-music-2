import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { PlayContext } from "../context/PlayContext";
import { songsData } from "../assets/assets";

const SongPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { plaWithID, showContextMenu, track, playStatus } = useContext(PlayContext);

    // Find the song
    const song = songsData.find(s => String(s.id) === id);

    if (!song) {
        return <div className="p-8 text-white">Song not found</div>;
    }

    // Get recommended songs (other songs that aren't the current one)
    const recommendedSongs = songsData.filter(s => s.id !== song.id).slice(0, 5);

    const handlePlay = () => {
        plaWithID(song.id);
    };

    const isCurrentSong = track && track.id === song.id;

    return (
        <div className="p-4">
            {/* Song Header */}
            <div className="flex items-end gap-6 mb-8 mt-4">
                {/* Song Cover */}
                <div className="w-56 h-56 rounded shadow-2xl flex-shrink-0">
                    <img
                        src={song.image}
                        alt={song.name}
                        className="w-full h-full object-cover rounded"
                    />
                </div>

                {/* Song Info */}
                <div className="flex flex-col">
                    <span className="text-sm font-medium">Song</span>
                    <h1 className="text-6xl font-bold mt-2 mb-4">{song.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-spotify-text-secondary">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                            <img src={song.image} alt={song.author} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-white hover:underline cursor-pointer">{song.author || "Unknown Artist"}</span>
                        <span>•</span>
                        <span>{song.name}</span>
                        <span>•</span>
                        <span>{song.duration}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-8">
                {/* Play Button */}
                <button
                    onClick={handlePlay}
                    className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                    {isCurrentSong && playStatus ? (
                        <svg role="img" height="24" width="24" viewBox="0 0 24 24" fill="black">
                            <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
                        </svg>
                    ) : (
                        <svg role="img" height="24" width="24" viewBox="0 0 24 24" fill="black">
                            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                        </svg>
                    )}
                </button>

                {/* Add to Liked Songs */}
                <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
                    <svg role="img" height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"></path>
                        <path d="M11.999 7.5a.75.75 0 0 1 .75.75v3h3a.75.75 0 0 1 0 1.5h-3v3a.75.75 0 0 1-1.5 0v-3h-3a.75.75 0 0 1 0-1.5h3v-3a.75.75 0 0 1 .75-.75z"></path>
                    </svg>
                </button>

                {/* Download */}
                <button className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors">
                    <svg role="img" height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"></path>
                        <path d="M12 7.25a.75.75 0 0 1 .75.75v5.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V8a.75.75 0 0 1 .75-.75z"></path>
                    </svg>
                </button>

                {/* More Options */}
                <button
                    onClick={(e) => showContextMenu(e, song)}
                    className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white transition-colors"
                >
                    <svg role="img" height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                    </svg>
                </button>
            </div>

            {/* Artist Card */}
            <div className="mb-8 p-4 bg-white/5 rounded-lg inline-flex items-center gap-4 hover:bg-white/10 cursor-pointer transition-colors">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img src={song.image} alt={song.author} className="w-full h-full object-cover" />
                </div>
                <div>
                    <p className="text-xs text-spotify-text-secondary">Artist</p>
                    <p className="font-bold text-white">{song.author || "Unknown Artist"}</p>
                </div>
            </div>

            {/* Recommended Section */}
            <div className="mt-8">
                <div className="mb-4">
                    <h2 className="text-xl font-bold">Recommended</h2>
                    <p className="text-sm text-spotify-text-secondary">Based on this song</p>
                </div>

                {/* Recommended Songs List */}
                <div className="space-y-1">
                    {recommendedSongs.map((recSong) => (
                        <div
                            key={recSong.id}
                            onClick={() => navigate(`/song/${recSong.id}`)}
                            onContextMenu={(e) => showContextMenu(e, recSong)}
                            className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-2 items-center text-spotify-text-secondary hover:bg-white/10 rounded-md cursor-pointer group"
                        >
                            <img
                                className="w-10 h-10 rounded object-cover"
                                src={recSong.image}
                                alt={recSong.name}
                            />
                            <div className="min-w-0">
                                <p className="text-white font-medium truncate">{recSong.name}</p>
                                <p className="text-sm truncate">{recSong.author}</p>
                            </div>
                            <p className="text-sm tabular-nums">1,234,567</p>
                            <div className="flex items-center gap-2">
                                <svg className="text-spotify-green" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z"></path>
                                </svg>
                                <span className="text-sm">{recSong.duration}</span>
                            </div>
                            {/* More options button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showContextMenu(e, recSong);
                                }}
                                className="w-8 h-8 flex items-center justify-center text-spotify-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg role="img" height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popular Tracks by Artist */}
            <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">Popular Tracks by {song.author || "this artist"}</h2>
                <div className="space-y-1">
                    {songsData.filter(s => s.author === song.author && s.id !== song.id).slice(0, 5).map((artistSong, index) => (
                        <div
                            key={artistSong.id}
                            onClick={() => navigate(`/song/${artistSong.id}`)}
                            onContextMenu={(e) => showContextMenu(e, artistSong)}
                            className="grid grid-cols-[16px_auto_1fr_auto] gap-4 px-4 py-2 items-center text-spotify-text-secondary hover:bg-white/10 rounded-md cursor-pointer group"
                        >
                            <span className="text-sm">{index + 1}</span>
                            <img
                                className="w-10 h-10 rounded object-cover"
                                src={artistSong.image}
                                alt={artistSong.name}
                            />
                            <div className="min-w-0">
                                <p className="text-white font-medium truncate">{artistSong.name}</p>
                            </div>
                            <p className="text-sm">{artistSong.duration}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SongPage;
