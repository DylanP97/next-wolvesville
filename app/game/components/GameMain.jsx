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
      className={`${weather} h-screen w-full flex flex-col flex-grow relative pt-[60px]`}
    >
      <div className="z-20 flex justify-between items-center w-full px-4">
        <GameHeader />
        <div className="flex justify-center items-center gap-2">
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
      </div>
      <Background />
      <PlayerInfos />
      <GameGrid />
      <ActionsHistory />
      {clientPlayer.isAlive && <ActionBar />}
      {winningTeam !== null && <WinnerOverlay />}
    </section>
  );
};

export default GameMain;
