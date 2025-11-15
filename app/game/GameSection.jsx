"use client";

import Background from "./Background";
import WinnerOverlay from "./WinnerOverlay";
import ActionBar from "./ActionBar";
import GameHeader from "./GameHeader";
import GameGrid from "./GameGrid";
import ChatModal from "./ChatModal";
import { useGame } from "./GameProvider";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

const GameSection = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { winningTeam, timeOfTheDay } = useGame();
  const { width, height } = useWindowSize();

  const getBackgroundGradient = () => {
    switch (timeOfTheDay) {
      case "daytime":
        return "bg-gradient-to-b from-sky-500 via-sky-200 to-sky-100";
      case "votetime":
        return "bg-gradient-to-b from-orange-400 via-orange-300 to-amber-200";
      case "nighttime":
        return "bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900";
      default:
        return "bg-gradient-to-b from-slate-900 to-blue-900";
    }
  };

  return (
    <section className={`w-full flex flex-col flex-grow relative ${getBackgroundGradient()}`}>
      <GameHeader />
      <GameGrid />
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
    </section>
  );
};

export default GameSection;
