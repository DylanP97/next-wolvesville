"use client";

import Background from "./Background";
import WinnerOverlay from "./WinnerOverlay";
import ActionsHistory from "./ActionsHistory";
import ActionBar from "./ActionBar";
import GameHeader from "./GameHeader";
import GameGrid from "./GameGrid";
import { useGame } from "./GameProvider";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

const GameSection = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { winningTeam, weather } = useGame();
  const { width, height } = useWindowSize();

  return (
    <section className={`w-full flex flex-col flex-grow relative`}>
      <GameHeader />
      <GameGrid />
      <ActionsHistory />
      <ActionBar
        summaryIsOpen={summaryIsOpen}
        setSummaryIsOpen={setSummaryIsOpen}
      />
      {/* <Background /> */}
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
