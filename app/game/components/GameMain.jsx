"use client";

import Background from "./Background";
import WinnerOverlay from "./winner-overlay/WinnerOverlay";
import ActionsHistory from "./ActionsHistory";
import ActionBar from "./ActionBar";
import PlayerInfos from "./PlayerInfos";
import GameHeader from "./GameHeader";
import GameGrid from "./GameGrid";
import { useGame } from "../providers/GameProvider";

const GameMain = () => {
  const { timeOfTheDay, winningTeam, clientPlayer } = useGame();

  // const weather = {
  //   daytime: "bg-sky-500",
  //   votetime: "bg-sky-700",
  //   nighttime: "bg-[#303030]",
  // };
  // ${weather[timeOfTheDay]

  return (
    <section
      className={` bg-background absolute top-0 left-0 relative outline-none`}
    >
      <Background />
      <GameHeader />
      <PlayerInfos />
      <GameGrid />
      <ActionsHistory />
      {clientPlayer.isAlive && <ActionBar />}
      {winningTeam !== null && <WinnerOverlay />}
    </section>
  );
};

export default GameMain;
