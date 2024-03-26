"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { game, socket, username } = useAuth();

  if (game) {
    const [clientPlayer, setClientPlayer] = useState(
      game.playersList.find((p) => p.name == username)
    );

    console.log("gameee")
    console.log(game)

    const gameId = game.id;
    const timeOfTheDay = game.timeOfTheDay;
    const dayCount = game.dayCount;
    const timeCounter = game.timeCounter;
    const winningTeam = game.winningTeam || null;

    const playersList = game.playersList;

    const isWolf = clientPlayer.role.team.includes("werewolves");
    const isJailer = clientPlayer.role.name === "Jailer";
    const isUnderArrest = clientPlayer.isUnderArrest;
    const hasHandcuffed = clientPlayer.hasHandcuffed;

    const jailChat = game.jailNightMessages;
    const wolvesChat = game.wolvesMessagesHistory;
    const generalChat = game.messagesHistory;

    const [isSelection, setIsSelection] = useState(false);
    const [isDoubleSelection, setIsDoubleSelection] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [actionType, setActionType] = useState("");

    useEffect(() => {
      if (!winningTeam) {
        setClientPlayer(game.playersList.find((p) => p.name == username));
        socket.emit("checkForWinner", game.id);
      }
    }, [game]);

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
