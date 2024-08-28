"use client";

import Background from "./GameMain/Background";
import WinnerOverlay from "./GameMain/WinnerOverlay";
import ActionsHistory from "./GameMain/ActionsHistory";
import ActionBar from "./GameMain/ActionBar";
import GameHeader from "./GameMain/GameHeader";
import GameGrid from "./GameMain/GameGrid";
import { useGame } from "./providers/GameProvider";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

const GameMain = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { winningTeam, weather } = useGame();
  const { width, height } = useWindowSize();

  return (
    <section className={`${weather} w-full flex flex-col flex-grow `}>
      <Background />
      <GameHeader />
      {/* <PlayerInfos /> */}
      <GameGrid />
      <ActionsHistory />
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

export default GameMain;
