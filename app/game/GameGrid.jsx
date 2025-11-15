"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useGame } from "./GameProvider";
import PlayerGridCard from "./PlayerGridCard";
import handlePlayerClick from "./handlePlayerClick";
import { useSound } from "../providers/SoundProvider";
import i18n from "../lib/i18n";
import { useTranslation } from "react-i18next";
import { useAnimation } from "../providers/AnimationProvider";

const GameGrid = () => {
  const { triggerSimpleMessage } = useAnimation();

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { socket } = useAuth();
  const { generateNoise } = useSound();

  const { t } = useTranslation();

  const language = i18n.language;

  const {
    playersList,
    timeOfTheDay,
    gameId,
    clientPlayer,
    isJailer,
    isSelection,
    setIsSelection,
    isDoubleSelection,
    setIsDoubleSelection,
    isBlocked,
    setIsBlocked,
    actionType,
  } = useGame();

  const { triggerAnimation } = useAnimation();

  const handleClick = (player) => {
    handlePlayerClick(
      actionType,
      clientPlayer,
      gameId,
      isJailer,
      socket,
      timeOfTheDay,
      isBlocked,
      isSelection,
      isDoubleSelection,
      setIsBlocked,
      setIsSelection,
      setIsDoubleSelection,
      player,
      setSelectedPlayer,
      selectedPlayer1,
      setSelectedPlayer1,
      setErrorMessage,
      triggerAnimation,
      language
    );
  };

  useEffect(() => {
    setSelectedPlayer(null);
    setSelectedPlayer1(null);
  }, [timeOfTheDay]);

  useEffect(() => {
    if (errorMessage) {
      triggerSimpleMessage(`${t(errorMessage)}`);
      generateNoise("selectionError");
      setErrorMessage(null);
    }
  }, [errorMessage]);

  return (
    <div className={`grid grid-cols-3 md:grid-cols-4 gap-4 place-items-center z-10 px-4 py-6`}>
      {playersList.map((player) => {
        const isAlsoWolf =
          player &&
          player.role &&
          player.role.team &&
          player.role.team === "Werewolves";

        return (
          <PlayerGridCard
            key={"plycard-" + player.id}
            player={player}
            selectedPlayer={selectedPlayer}
            selectedPlayer1={selectedPlayer1}
            isAlsoWolf={isAlsoWolf}
            handleClick={handleClick}
          />
        );
      })}
    </div>
  );
};

export default GameGrid;
