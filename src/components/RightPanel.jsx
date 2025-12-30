import { useContext } from "react";
import { PlayContext } from "../context/PlayContext";
import { artistsData } from "../assets/assets";

const RightPanel = () => {
    const { track } = useContext(PlayContext);
    const artist = artistsData[0]; // Default to first artist

    return (
        <div className="w-80 h-full bg-spotify-dark rounded-lg overflow-y-auto hide-scrollbar flex-shrink-0 hidden xl:block">
            {/* Album Art Section */}
            <div className="p-4">
                <div className="relative group">
                    <img
                        src={track.image}
                        alt={track.name}
                        className="w-full aspect-square object-cover rounded-lg"
                    />
                    {/* Expand button on hover */}
                    <button className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                            role="img"
                            height="16"
                            width="16"
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            fill="white"
                        >
                            <path d="M6.53 9.47a.75.75 0 0 1 0 1.06L4.56 12.5h1.94a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 1.5 0v1.94l1.97-1.97a.75.75 0 0 1 1.06 0zm0-2.94L4.56 4.56H6.5a.75.75 0 0 1 0-1.5H3a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0V5.37l1.97 1.97a.75.75 0 0 0 1.06-1.06zm2.94 2.94a.75.75 0 0 1 1.06 0l1.97 1.97v-1.94a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1 0-1.5h1.94l-1.97-1.97a.75.75 0 0 1 0-1.06zm1.06-4.03l1.97-1.97V5.5a.75.75 0 0 0 1.5 0V2a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.94L9.53 4.72a.75.75 0 1 0 1.06 1.06l-.06-.06z"></path>
                        </svg>
                    </button>
                </div>

                {/* Track Info */}
                <div className="mt-4 flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-white truncate">{track.name}</h2>
                        <div className="flex items-center gap-1 mt-1">
                            {track.isVerified && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            )}
                        </div>
                    </div>
                    <button className="w-6 h-6 flex items-center justify-center text-spotify-green">
                        <svg
                            role="img"
                            height="24"
                            width="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* About the Artist Section */}
            <div className="px-4 pb-4">
                <div className="bg-spotify-elevated rounded-lg overflow-hidden">
                    {/* Artist Image */}
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={artist.image}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <p className="text-xs text-spotify-text-secondary mb-1">About the artist</p>
                        </div>
                        {/* Carousel Arrow */}
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                            <svg
                                role="img"
                                height="16"
                                width="16"
                                viewBox="0 0 16 16"
                                fill="white"
                            >
                                <path d="M4.97 2.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06L9.44 8 4.97 3.53a.75.75 0 0 1 0-1.06z"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Artist Info */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{artist.name}</span>
                                {artist.isVerified && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#3b82f6">
                                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-spotify-text-secondary mb-3">
                            {artist.monthlyListeners} monthly listeners
                        </p>
                        <button className="px-4 py-1.5 border border-spotify-text-subdued rounded-full text-sm font-semibold text-white hover:border-white hover:scale-105 transition-all">
                            Follow
                        </button>
                        <p className="mt-4 text-sm text-spotify-text-secondary line-clamp-3">
                            {artist.bio}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightPanel;
