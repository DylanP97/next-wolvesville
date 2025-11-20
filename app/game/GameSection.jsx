"use client";

import WinnerOverlay from "./WinnerOverlay";
import ActionBar from "./ActionBar";
import DeathFlash from "./DeathFlash";
import GameHeader from "./GameHeader";
import GameGrid from "./GameGrid";
import ChatModal from "./ChatModal";
import { useGame } from "./GameProvider";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import GameMenuExitOverlay from "./GameMenuExitOverlay";
import { useToRender } from "../providers/RenderProvider";

const GameSection = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { winningTeam, timeOfTheDay } = useGame();
  const { width, height } = useWindowSize();
  const { exitMenuOpen, toggleExitMenu } = useToRender();


  const getBackgroundGradient = () => {
    switch (timeOfTheDay) {
      case "daytime":
        return "bg-gradient-to-b from-sky-500 via-sky-200 to-sky-100";
      case "votetime":
        return "bg-gradient-to-b from-orange-400 via-orange-300 to-amber-200";
      case "votetimeAftermath":
        return "bg-gradient-to-b from-orange-700 via-orange-600 to-amber-700";
      case "nighttime":
        return "bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900";
      case "nighttimeAftermath":
        return "bg-gradient-to-b from-slate-700 via-slate-600 to-blue-800";
      default:
        return "bg-gradient-to-b from-slate-900 to-blue-900";
    }
  };

  return (
    <div className={`relative w-full h-screen ${getBackgroundGradient()}`}>
      <DeathFlash />

      {/* Header fixe en haut */}
      <div className="sticky top-0 left-0 right-0 z-30">
        <GameHeader />
      </div>

      {/* Container principal avec padding pour header et action bar */}
      <div className="h-full overflow-hidden">
        {/* pt-16 pour le header, pb-32 pour l'action bar */}
        <div className="h-full overflow-y-auto">
          <GameGrid />
        </div>
      </div>

      {/* Action Bar fixe en bas */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <ActionBar
          summaryIsOpen={summaryIsOpen}
          setSummaryIsOpen={setSummaryIsOpen}
        />
      </div>

      {winningTeam !== null && (
        <>
          <Confetti width={width} height={height} style={{ zIndex: "999" }} />
          <WinnerOverlay />
        </>
      )}
      <GameMenuExitOverlay
        isOpen={exitMenuOpen}
        onClose={toggleExitMenu}
      />
      <ChatModal />
    </div>
  );
};

export default GameSection;
