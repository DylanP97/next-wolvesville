"use client";

import Image from "next/image";
import { useAuth } from "../../providers/AuthProvider";
import { useGame } from "../providers/GameProvider";
import { Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { divActionIcon, imgActionIcon } from "../../lib/styles";

const PauseToggle = () => {
  const { socket } = useAuth();
  const { gameId, isPaused } = useGame();
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

  return (
    <Tooltip content="Play/Pause Game" color="secondary" variant="flat">
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
