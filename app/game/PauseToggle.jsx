"use client";

import Image from "next/image";
import { useAuth } from "../providers/AuthProvider";
import { useGame } from "./GameProvider";
import { useDevMode } from "../providers/DevModeProvider";
import { Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { divActionIcon, imgActionIcon } from "../lib/styles";
import { prefixDevText } from "../lib/devUtils";

const PauseToggle = () => {
  const { socket, isDev } = useAuth();
  const { gameId, isPaused } = useGame();
  const { isDevMode } = useDevMode();
  const [gamePaused, setGamePaused] = useState(false);

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

  if (!isDevMode || !isDev) {
    return null;
  }

  return (
    <Tooltip content={prefixDevText("Allow the developer to pause and resume the game", isDevMode)} color="secondary" variant="flat">
      <div
        onClick={gamePaused ? resumeGame : pauseGame}
        className={`${
          gamePaused ? "bg-slate-500 hover:bg-slate-400" : "bg-secondary hover:bg-slate-400"
        } ${divActionIcon}`}
      >
        <Image
          src={
            gamePaused
              ? "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1719309608/play-button-arrowhead_rtfcup.png"
              : "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1719309608/pause_v6iqbq.png"
          }
          alt={"Play/Pause Game"}
          width={50}
          height={50}
          style={{ height: "auto", width: "auto" }}
          className={`${imgActionIcon}`}
        />
      </div>
    </Tooltip>
  );
};

export default PauseToggle;
