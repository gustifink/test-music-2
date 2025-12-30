import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  quickAccessData,
  pickedForYouData,
  showsData,
  recentlyPlayedData,
  popularWithListenersData,
  songsData
} from "../assets/assets";
import { useContext } from "react";
import { PlayContext } from "../context/PlayContext";

function DisplayHome() {
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();
  const { plaWithID, showContextMenu } = useContext(PlayContext);
  const filters = ["All", "Music", "Podcasts", "Audiobooks"];

  return (
    <div className="p-4 pb-8">
      {/* Filter Pills */}
      <div className="flex gap-2 mb-6 sticky top-0 bg-spotify-dark py-2 z-10">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`filter-pill ${activeFilter === filter
              ? "filter-pill-active"
              : "filter-pill-inactive"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {quickAccessData.map((item, index) => {
          const song = songsData[index % songsData.length];
          return (
            <div
              key={item.id}
              onClick={() => plaWithID(song.id)}
              onContextMenu={(e) => showContextMenu(e, song)}
              className="flex items-center bg-white/5 rounded-md overflow-hidden hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 md:w-14 md:h-14 object-cover"
              />
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/song/${song.id}`);
                }}
                className="px-3 font-semibold text-sm flex-1 truncate hover:underline"
              >
                {item.name}
              </span>
              {/* Play button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  plaWithID(song.id);
                }}
                className="w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center mr-2 opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0"
              >
                <svg
                  role="img"
                  height="16"
                  width="16"
                  viewBox="0 0 16 16"
                  fill="black"
                >
                  <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                </svg>
              </button>
            </div>
          );
        })}
      </div>



      {/* Picked for you Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Picked for you</h2>
        </div>
        <div className="flex gap-6">
          {/* Featured Card */}
          <div
            onClick={() => plaWithID(0)}
            className="w-64 flex-shrink-0 cursor-pointer group"
          >
            <div className="relative mb-3">
              <img
                src={pickedForYouData.image}
                alt={pickedForYouData.name}
                className="w-full aspect-square object-cover rounded-lg shadow-lg"
              />
              {/* Play button */}
              <button className="absolute bottom-2 right-2 w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0">
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
              {/* Add button */}
              <button className="absolute bottom-2 left-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  role="img"
                  height="16"
                  width="16"
                  viewBox="0 0 16 16"
                  fill="white"
                >
                  <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                  <path d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75z"></path>
                </svg>
              </button>
            </div>
          </div>
          {/* Playlist Info */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-spotify-text-secondary mb-1">{pickedForYouData.type}</p>
            <h3 className="text-3xl font-bold mb-2">{pickedForYouData.name}</h3>
            <p className="text-sm text-spotify-text-secondary">{pickedForYouData.description}</p>
          </div>
        </div>
      </section>

      {/* Your shows Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Your shows</h2>
          <button className="text-sm text-spotify-text-secondary hover:underline font-semibold">
            Show all
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {showsData.map((show) => (
            <div
              key={show.id}
              className="min-w-[150px] max-w-[150px] p-3 rounded-lg bg-spotify-elevated hover:bg-spotify-highlight transition-colors cursor-pointer group"
            >
              <div className="relative mb-3">
                <img
                  src={show.image}
                  alt={show.name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                {show.hasNewEpisode && (
                  <div className="absolute bottom-1 left-1 bg-blue-500 text-xs px-1.5 py-0.5 rounded-sm font-medium">
                    NEW
                  </div>
                )}
                {/* Play button */}
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0">
                  <svg
                    role="img"
                    height="16"
                    width="16"
                    viewBox="0 0 16 16"
                    fill="black"
                  >
                    <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                  </svg>
                </button>
              </div>
              <p className="font-semibold truncate text-sm">{show.name}</p>
              <p className="text-xs text-spotify-text-secondary truncate">{show.creator}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recently played Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recently played</h2>
          <button className="text-sm text-spotify-text-secondary hover:underline font-semibold">
            Show all
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {recentlyPlayedData.map((item, index) => {
            const song = songsData[index % songsData.length];
            return (
              <div
                key={item.id}
                onClick={() => plaWithID(song.id)}
                onContextMenu={(e) => showContextMenu(e, song)}
                className="min-w-[150px] max-w-[150px] p-3 rounded-lg bg-spotify-elevated hover:bg-spotify-highlight transition-colors cursor-pointer group"
              >
                <div className="relative mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`w-full aspect-square object-cover ${item.isShow ? 'rounded-lg' : 'rounded-lg'}`}
                  />
                  {/* Play button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      plaWithID(song.id);
                    }}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0"
                  >
                    <svg
                      role="img"
                      height="16"
                      width="16"
                      viewBox="0 0 16 16"
                      fill="black"
                    >
                      <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                    </svg>
                  </button>
                </div>
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/song/${song.id}`);
                  }}
                  className="font-semibold truncate text-sm hover:underline"
                >
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular with listeners of */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-spotify-text-secondary mb-1">Popular with listeners of</p>
            <h2 className="text-2xl font-bold">{popularWithListenersData.title}</h2>
          </div>
          <button className="text-sm text-spotify-text-secondary hover:underline font-semibold">
            Show all
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {popularWithListenersData.items.map((item) => (
            <div
              key={item.id}
              className="min-w-[150px] max-w-[150px] p-3 rounded-lg bg-spotify-elevated hover:bg-spotify-highlight transition-colors cursor-pointer group"
            >
              <div className="relative mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                {/* Play button */}
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg transform translate-y-2 group-hover:translate-y-0">
                  <svg
                    role="img"
                    height="16"
                    width="16"
                    viewBox="0 0 16 16"
                    fill="black"
                  >
                    <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                  </svg>
                </button>
              </div>
              <p className="font-semibold truncate text-sm">{item.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DisplayHome;
