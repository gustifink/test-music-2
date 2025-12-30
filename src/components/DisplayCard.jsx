import { useParams } from "react-router-dom";
import { albumsData, assets, songsData } from "../assets/assets";
import { useContext } from "react";
import { PlayContext } from "../context/PlayContext";

const DisplayCard = () => {
  const { id } = useParams();
  const albumData = albumsData[id] || albumsData[0];
  const { plaWithID, showContextMenu } = useContext(PlayContext);

  return (
    <div className="p-4">
      {/* Album Header */}
      <div className="mt-4 flex gap-6 flex-col md:flex-row md:items-end mb-8">
        <img
          className="w-48 h-48 rounded-lg shadow-2xl object-cover"
          src={albumData.image}
          alt={albumData.name}
        />
        <div className="flex flex-col">
          <p className="text-sm font-medium">Playlist</p>
          <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-4">{albumData.name}</h1>
          <p className="text-sm text-spotify-text-secondary">{albumData.desc}</p>
          <div className="flex items-center gap-2 mt-4">
            <img
              className="w-5 h-5"
              src={assets.spotify_logo}
              alt="Spotify"
            />
            <span className="font-semibold text-sm">Spotify</span>
            <span className="text-spotify-text-secondary text-sm">• 1,323,154 likes • 50 songs, about 2 hr 30 min</span>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-6 mb-6">
        <button
          onClick={() => plaWithID(0)}
          className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 hover:bg-spotify-green-light transition-all"
        >
          <svg
            role="img"
            height="24"
            width="24"
            viewBox="0 0 24 24"
            fill="black"
          >
            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
          </svg>
        </button>
        <button className="text-spotify-text-secondary hover:text-white transition-colors">
          <svg
            role="img"
            height="24"
            width="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M5.21 1.57a6.757 6.757 0 0 1 6.708 1.545.124.124 0 0 0 .165 0 6.741 6.741 0 0 1 5.715-1.78l.004.001a6.802 6.802 0 0 1 5.571 5.376v.003a6.689 6.689 0 0 1-1.49 5.655l-7.954 9.48a2.518 2.518 0 0 1-3.857 0L2.12 12.37A6.683 6.683 0 0 1 .627 6.714 6.757 6.757 0 0 1 5.21 1.57zm3.12 1.803a4.757 4.757 0 0 0-5.74 3.725l-.001.002a4.684 4.684 0 0 0 1.049 3.969l.009.01 7.958 9.485a.518.518 0 0 0 .79 0l7.968-9.495a4.688 4.688 0 0 0 1.049-3.965 4.803 4.803 0 0 0-3.931-3.794 4.74 4.74 0 0 0-4.023 1.256l-.008.008a2.123 2.123 0 0 1-2.9 0l-.007-.007a4.757 4.757 0 0 0-2.214-1.194z"></path>
          </svg>
        </button>
        <button className="text-spotify-text-secondary hover:text-white transition-colors">
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
      </div>

      {/* Song List Header */}
      <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-spotify-text-secondary text-sm border-b border-white/10 mb-2">
        <span>#</span>
        <span>Title</span>
        <span className="hidden md:block">Album</span>
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

      {/* Song List */}
      {songsData.map((item, index) => (
        <div
          onClick={() => plaWithID(item.id)}
          onContextMenu={(e) => showContextMenu(e, item)}
          key={index}
          className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 items-center text-spotify-text-secondary hover:bg-white/10 rounded-md cursor-pointer group"
        >
          {/* Track Number / Play Icon */}
          <div className="relative">
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
          </div>

          {/* Title & Artist */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              className="w-10 h-10 rounded object-cover"
              src={item.image}
              alt={item.name}
            />
            <div className="min-w-0">
              <p className="text-white font-medium truncate group-hover:text-spotify-green transition-colors">{item.name}</p>
              <p className="text-sm truncate">{item.author}</p>
            </div>
          </div>

          {/* Album */}
          <p className="text-sm truncate hidden md:block hover:underline cursor-pointer">{albumData.name}</p>

          {/* Duration */}
          <p className="text-sm text-right">{item.duration}</p>
        </div>
      ))}
    </div>
  );
};

export default DisplayCard;
