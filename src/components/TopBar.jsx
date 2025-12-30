import { assets } from "../assets/assets";

const TopBar = () => {
    return (
        <div className="h-16 bg-black flex items-center justify-between px-4 gap-4">
            {/* Left section - Spotify logo */}
            <div className="flex items-center">
                <img
                    src={assets.spotify_logo}
                    alt="Spotify"
                    className="w-8 h-8"
                />
            </div>

            {/* Center section - Home button and Search */}
            <div className="flex items-center gap-2 flex-1 max-w-2xl">
                {/* Home button */}
                <button className="w-12 h-12 bg-spotify-elevated rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                    <svg
                        role="img"
                        height="24"
                        width="24"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="white"
                    >
                        <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z"></path>
                    </svg>
                </button>

                {/* Search bar */}
                <div className="flex-1 relative">
                    <div className="flex items-center bg-spotify-elevated rounded-full h-12 px-4 hover:bg-spotify-highlight transition-colors border border-transparent focus-within:border-white">
                        <svg
                            role="img"
                            height="24"
                            width="24"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="#b3b3b3"
                            className="mr-3"
                        >
                            <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z"></path>
                        </svg>
                        <input
                            type="text"
                            placeholder="What do you want to play?"
                            className="bg-transparent flex-1 outline-none text-white placeholder-spotify-text-secondary text-sm"
                        />
                        <div className="h-6 w-px bg-spotify-text-subdued mx-3"></div>
                        <svg
                            role="img"
                            height="24"
                            width="24"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="#b3b3b3"
                            className="cursor-pointer hover:fill-white transition-colors"
                        >
                            <path d="M4 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4H4V2zM1.513 9.37A1 1 0 0 1 2.291 9H21.71a1 1 0 0 1 .978 1.208l-2.17 10.208A2 2 0 0 1 18.562 22H5.438a2 2 0 0 1-1.956-1.584l-2.17-10.208a1 1 0 0 1 .201-.837zM12 17.834a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Right section - Install App, Settings, User */}
            <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 bg-spotify-elevated hover:bg-spotify-highlight rounded-full px-4 py-2 text-sm font-semibold transition-colors">
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        fill="white"
                    >
                        <path d="M4.995 8.745a.75.75 0 0 1 1.06 0L7.25 9.939V4a.75.75 0 0 1 1.5 0v5.94l1.195-1.195a.75.75 0 1 1 1.06 1.06L8 12.81l-3.005-3.005a.75.75 0 0 1 0-1.06z"></path>
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z"></path>
                    </svg>
                    Install App
                </button>

                {/* Notifications/Settings */}
                <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-spotify-elevated transition-colors">
                    <svg
                        role="img"
                        height="16"
                        width="16"
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        fill="#b3b3b3"
                    >
                        <path d="M8 1.5a4 4 0 0 0-4 4v3.27a.75.75 0 0 1-.1.373L2.255 12h11.49L12.1 9.142a.75.75 0 0 1-.1-.374V5.5a4 4 0 0 0-4-4zm-5.5 4a5.5 5.5 0 0 1 11 0v3.067l2.193 3.809a.75.75 0 0 1-.65 1.124H10.5a2.5 2.5 0 0 1-5 0H.957a.75.75 0 0 1-.65-1.124L2.5 8.569V5.5zm4.5 8a1 1 0 1 0 2 0H7z"></path>
                    </svg>
                </button>

                {/* User avatar */}
                <button className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <img
                        src="https://i.pravatar.cc/32"
                        alt="User"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span class="text-xs font-bold">S</span>';
                        }}
                    />
                </button>
            </div>
        </div>
    );
};

export default TopBar;
