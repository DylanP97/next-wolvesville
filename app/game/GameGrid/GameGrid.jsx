"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { useGame } from "../GameProvider";
import PlayerGridCard from "./PlayerGridCard";
import handlePlayerClick from "../handlePlayerClick";
import { useSound } from "../../providers/SoundProvider";
import i18n from "../../lib/i18n";
import { useTranslation } from "react-i18next";
import { useAnimation } from "../../providers/AnimationProvider";

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
    selectionState,
    selectionHelpers,
  } = useGame();

  const { mode } = selectionState;

  const { triggerAnimation } = useAnimation();

  const handleClick = (player) => {
    if (mode === 'single') setSelectedPlayer(player.id);
    if (mode === 'double') !selectedPlayer ? setSelectedPlayer(player.id) : setSelectedPlayer1(player.id);
    handlePlayerClick(
      player,
      clientPlayer,
      gameId,
      socket,
      timeOfTheDay,
      triggerAnimation,
      setErrorMessage,
      selectionState,
      selectionHelpers,
      t
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
    <div className="grid grid-cols-4 md:grid-cols-4 gap-1 place-items-start z-10 px-2 md:px-6 flex-1">
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