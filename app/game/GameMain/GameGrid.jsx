"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { useGame } from "../providers/GameProvider";
import PlayerGridCard from "./GameGrid/PlayerGridCard";
import handlePlayerClick from "./GameGrid/handlePlayerClick";
import { useGameAnimations } from "../providers/GameAnimationsProvider";

const GameGrid = () => {
  const { triggerSimpleMessage } = useGameAnimations();

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { socket } = useAuth();

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
      setErrorMessage
    );
  };

  useEffect(() => {
    setSelectedPlayer(null);
    setSelectedPlayer1(null);
  }, [timeOfTheDay]);

  useEffect(() => {
    if (errorMessage) {
      triggerSimpleMessage(errorMessage);
      setErrorMessage(null);
    }
  }, [errorMessage]);

  return (
    <div className={`grid grid-cols-4 place-items-center`}>
      {playersList.map((player) => {
        const isAlsoWolf =
          player &&
          player.role &&
          player.role.team &&
          player.role.team.includes("werewolves");

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
