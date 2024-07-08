"use client";

import Background from "./GameMain/Background";
import WinnerOverlay from "./GameMain/WinnerOverlay";
import ActionsHistory from "./GameMain/ActionsHistory";
import ActionBar from "./GameMain/ActionBar";
import PlayerInfos from "./GameMain/PlayerInfos";
import GameHeader from "./GameMain/GameHeader";
import GameGrid from "./GameMain/GameGrid";
import { useGame } from "./providers/GameProvider";

const GameMain = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { winningTeam, weather } = useGame();

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
      {winningTeam !== null && <WinnerOverlay />}
    </section>
  );
};

export default GameMain;
