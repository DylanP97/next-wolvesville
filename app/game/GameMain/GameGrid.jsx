"use client";

import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { useGame } from "../providers/GameProvider";
import PlayerGridCard from "./GameGrid/PlayerGridCard";
import handlePlayerClick from "./GameGrid/handlePlayerClick";

const GameGrid = () => {
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
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

  const handleClick = (selectedPlayer) => {
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
      selectedPlayer,
      selectedPlayer1,
      setSelectedPlayer1
    );
  };

  return (
    <div className={`grid grid-cols-4 place-items-center`}>
      {playersList.map((player) => {
        const isAlsoWolf = player.role.team.includes("werewolves");

        return (
          <PlayerGridCard
            key={"plycard-" + player.id}
            player={player}
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
