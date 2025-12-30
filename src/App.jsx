import Sidebar from "./components/Sidebar";
import Play from "./components/Play";
import Display from "./components/Display";
import TopBar from "./components/TopBar";
import RightPanel from "./components/RightPanel";
import ContextMenu from "./components/ContextMenu";
import { useContext } from "react";
import { PlayContext } from "./context/PlayContext";

const App = () => {
  const { audioRef, track } = useContext(PlayContext);

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Top Navigation Bar */}
      <TopBar />

      {/* Main Content Area - 3 columns */}
      <div className="flex-1 flex gap-2 p-2 overflow-hidden">
        {/* Left Sidebar - Your Library */}
        <Sidebar />

        {/* Main Content */}
        <Display />

        {/* Right Panel - Now Playing Details */}
        <RightPanel />
      </div>

      {/* Bottom Player */}
      <Play />
      <audio ref={audioRef} src={track.file} preload="auto"></audio>

      {/* Context Menu (global) */}
      <ContextMenu />
    </div>
  );
};

export default App;
