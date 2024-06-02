"use client";

import Background from "./Background";
import WinnerOverlay from "./WinnerOverlay/WinnerOverlay";
import ActionsHistory from "./ActionsHistory";
import ActionBar from "./ActionBar";
import PlayerInfos from "./PlayerInfos";
import GameHeader from "./GameHeader";
import GameGrid from "./GameGrid";
import { useGame } from "../providers/GameProvider";
import { Button } from "@nextui-org/react";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect, useState } from "react";

const GameMain = () => {
  const { timeOfTheDay, winningTeam, clientPlayer, gameId, isPaused } =
    useGame();
  const { socket } = useAuth();
  const [gamePaused, setGamePaused] = useState(false);

  // const weather = {
  //   daytime: "bg-sky-500",
  //   votetime: "bg-sky-700",
  //   nighttime: "bg-[#303030]",
  // };
  // ${weather[timeOfTheDay]

  // Sync the local state with the game state from the server
  useEffect(() => {
    setGamePaused(isPaused);
  }, [isPaused]);

  const pauseGame = () => {
    socket.emit("pauseGame", gameId);
    setGamePaused(true);
  };

  const resumeGame = () => {
    socket.emit("resumeGame", gameId);
    setGamePaused(false);
  };

  return (
    <section
      className={` bg-background absolute top-0 left-0 relative outline-none`}
    >
      <Button
        className="absolute top-2 right-2 z-20"
        color="secondary"
        variant="solid"
        onClick={gamePaused ? resumeGame : pauseGame}
      >
        {gamePaused ? "Resume" : "Pause"}
      </Button>
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
