"use client";

const { Button } = require("@nextui-org/react");
const { useEffect, useState } = require("react");
import { useAuth } from "../../providers/AuthProvider";
import { useGame } from "../providers/GameProvider";

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
    <div className="z-20 flex justify-between items-center w-full px-4">
      <div className="flex justify-center items-center gap-2 absolute top-16">
        <Button
          isIconOnly
          color="secondary"
          variant="solid"
          onClick={gamePaused ? resumeGame : pauseGame}
          className="text-xs"
        >
          {gamePaused ? "▶" : "⏸"}
        </Button>
      </div>
    </div>
  );
};

export default PauseToggle;
