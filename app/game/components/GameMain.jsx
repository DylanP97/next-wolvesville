"use client";

import Background from "./Background";
import WinnerOverlay from "./WinnerOverlay";
import ActionsHistory from "./ActionsHistory";
import ActionBar from "./ActionBar";
import PlayerInfos from "./PlayerInfos";
import GameHeader from "./GameHeader";
import GameGrid from "./GameGrid";
import { useGame } from "../providers/GameProvider";

const GameMain = () => {
  const { timeOfTheDay, winningTeam } = useGame();

  const weather = {
    daytime: "bg-sky-500",
    votetime: "bg-sky-700",
    nighttime: "bg-black",
  };

  return (
    <section
      className={`${weather[timeOfTheDay]} 
      absolute top-0 left-0 relative outline-none`}
    >
      <Background />
      <GameHeader />
      <PlayerInfos />
      <GameGrid />
      <ActionsHistory />
      <ActionBar />

      {winningTeam !== null && <WinnerOverlay />}
    </section>
  );
};

export default GameMain;
