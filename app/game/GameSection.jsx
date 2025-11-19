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
    <section className={`w-full flex flex-col ${getBackgroundGradient()}`}>
      <DeathFlash />
      <GameHeader />
      <div className="h-screen flex flex-col flex-grow overflow-hidden pt-[88px]">
        <GameGrid />
      </div>
      <ChatModal />
      <ActionBar
        summaryIsOpen={summaryIsOpen}
        setSummaryIsOpen={setSummaryIsOpen}
      />
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

    </section>
  );
};

export default GameSection;
