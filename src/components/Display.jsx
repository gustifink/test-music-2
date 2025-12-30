import { Route, Routes, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayCard from "./DisplayCard";
import PlaylistPage from "./PlaylistPage";
import SongPage from "./SongPage";
import { useEffect, useRef } from "react";
import { albumsData } from "../assets/assets";

function Display() {
  const displayRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes("album");
  const isPlaylist = location.pathname.includes("playlist");
  const isSong = location.pathname.includes("song");
  const albumId = isAlbum ? location.pathname.split("/").pop() : "";
  const bgColor = isAlbum && albumsData[Number(albumId)]
    ? albumsData[Number(albumId)].bgColor
    : "#121212";

  useEffect(() => {
    if (isAlbum) {
      displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`;
    } else if (isPlaylist) {
      displayRef.current.style.background = `linear-gradient(#535353, #121212)`;
    } else if (isSong) {
      displayRef.current.style.background = `linear-gradient(#4a3f35, #121212)`;
    } else {
      displayRef.current.style.background = `#121212`;
    }
  });

  return (
    <div
      ref={displayRef}
      className="flex-1 rounded-lg bg-spotify-dark text-white overflow-y-auto hide-scrollbar"
    >
      <Routes>
        <Route path="/" element={<DisplayHome />} />
        <Route path="/album/:id" element={<DisplayCard />} />
        <Route path="/playlist/:id" element={<PlaylistPage />} />
        <Route path="/song/:id" element={<SongPage />} />
      </Routes>
    </div>
  );
}

export default Display;

