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
import { useTranslation } from "react-i18next";
import ListIcon from "./ListIcon";

const GameMain = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { winningTeam, clientPlayer, gameId, isPaused, weather } = useGame();
  const { socket } = useAuth();
  const [gamePaused, setGamePaused] = useState(false);
  const { t } = useTranslation();

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
      className={`${weather} absolute top-0 left-0 relative outline-none`}
    >
      <div className="absolute top-2 right-2 z-20 flex gap-2">
        <Button
          color="secondary"
          variant="solid"
          onClick={gamePaused ? resumeGame : pauseGame}
        >
          {gamePaused ? t("game.resume") : t("game.pause")}
        </Button>
        {!summaryIsOpen && (
          <Button
            color="secondary"
            variant="solid"
            onClick={() => setSummaryIsOpen(!summaryIsOpen)}
            isIconOnly
          >
            <ListIcon />
          </Button>
        )}
      </div>
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
