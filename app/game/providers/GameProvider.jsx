"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { game, socket, username } = useAuth();

  if (game) {
    const gameId = game.id;
    const playersList = game.playersList;
    const aliveList = game.playersList.filter((p) => p.isAlive);
    const clientPlayer = game.playersList.find((p) => p.name == username);
    const timeOfTheDay = game.timeOfTheDay;
    const dayCount = game.dayCount;
    const timeCounter = game.timeCounter;
    const winningTeam = game.winningTeam;
    const jailChat = game.jailNightMessages;
    const wolvesChat = game.wolvesMessagesHistory;
    const generalChat = game.messagesHistory;

    const isWolf = clientPlayer.role.team.includes("werewolves");
    const isJailer = clientPlayer.role.name === "Jailer";
    const isUnderArrest = clientPlayer.isUnderArrest;
    const hasHandcuffed = clientPlayer.hasHandcuffed;

    const [isSelection, setIsSelection] = useState(false);
    const [isDoubleSelection, setIsDoubleSelection] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [actionType, setActionType] = useState("");

    console.log("hello GameProvider");
    console.log(winningTeam);

    if (!winningTeam) {
      console.log("no winningTeam");
      socket.emit("checkForWinner", game.id);
    }

    useEffect(() => {
      setIsSelection(false);
      setIsDoubleSelection(false);
      setIsBlocked(false);
      setActionType("");
    }, [timeOfTheDay]);

    return (
      <GameContext.Provider
        value={{
          clientPlayer,
          gameId,
          timeOfTheDay,
          dayCount,
          timeCounter,
          winningTeam,
          playersList,
          aliveList,
          isWolf,
          isJailer,
          isUnderArrest,
          hasHandcuffed,
          jailChat,
          wolvesChat,
          generalChat,
          isSelection,
          isDoubleSelection,
          isBlocked,
          setIsSelection,
          setIsDoubleSelection,
          setIsBlocked,
          actionType,
          setActionType,
        }}
      >
        {children}
      </GameContext.Provider>
    );
  }
};

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used within an GameProvider");
  }

  return context;
};
