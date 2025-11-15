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
  const { winningTeam } = useGame();
  const { width, height } = useWindowSize();

  return (
    <section className={`w-full flex flex-col flex-grow relative`}>
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
