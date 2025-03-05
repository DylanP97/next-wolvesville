"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import cpuNextMove from "../lib/cpuNextMove";
import { useSound } from "../providers/SoundProvider";
import { useAnimation } from "../providers/AnimationProvider";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { game, socket, username, updateUserGameState } = useAuth();
  const { generateNoise } = useSound();
  const { triggerAnimation } = useAnimation();

  const weatherColors = {
    daytime: "bg-sky-500",
    votetime: "bg-sky-700",
    nighttime: "bg-black",
  };

  const [isSelection, setIsSelection] = useState(false);
  const [isDoubleSelection, setIsDoubleSelection] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [actionType, setActionType] = useState("");

  const gameId = game.id;
  const isPaused = game.isPaused;
  const playersList = game.playersList;
  const aliveList = game.playersList.filter((p) => p.isAlive);
  const clientPlayer = game.playersList.find((p) => p.name == username);
  const timeOfTheDay = game.timeOfTheDay;
  const [weather, setWeather] = useState(weatherColors[timeOfTheDay]);
  const dayCount = game.dayCount;
  const timeCounter = game.timeCounter;
  const winningTeam = game.winningTeam;
  const jailChat = game.jailNightMessages;
  const wolvesChat = game.wolvesMessagesHistory;
  const generalChat = game.messagesHistory;

  const isWolf = clientPlayer.role.team === "Werewolves";
  const isJailer = clientPlayer.role.name === "Jailer";
  const isAlive = clientPlayer.isAlive;
  const isUnderArrest = clientPlayer.isUnderArrest;
  const hasHandcuffed = clientPlayer.hasHandcuffed;

  if (!winningTeam) {
    socket.emit("checkForWinner", game.id);
  } else {
    !game.hasEnded && socket.emit("endGame", game.id);
    // updateUserGameState(true, false, game);
  }

  useEffect(() => {
    setIsSelection(false);
    setIsDoubleSelection(false);
    setIsBlocked(false);
    setActionType("");
    setWeather(weatherColors[timeOfTheDay]);
    if (timeOfTheDay === "nighttime" && !winningTeam) {
      generateNoise("wolfHowl");
      triggerAnimation("moon");
    }
    if (timeOfTheDay === "votetime" && !winningTeam) {
      generateNoise("pianoPercussion");
    }
    if (timeOfTheDay === "daytime" && !winningTeam) {
      generateNoise("rooster");
      triggerAnimation("happySun");
    }
  }, [timeOfTheDay]);

  useEffect(() => {
    if (!isAlive) generateNoise("grunt");
  }, [isAlive]);

  useEffect(() => {
    if (game.createdBy === clientPlayer.name) {
      playersList.map((player) => {
        if (player.isCPU && player.isAlive && !player.isUnderArrest) {
          if (timeCounter === player.randomSecond) {
            console.log("cpu move", player.randomSecond, player.name);
            cpuNextMove(
              player,
              dayCount,
              timeOfTheDay,
              playersList,
              socket,
              gameId
            );
          }
        }
      });
    }
  }, [timeCounter]);

  return (
    <GameContext.Provider
      value={{
        clientPlayer,
        gameId,
        isPaused,
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
        weather,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used within an GameProvider");
  }

  return context;
};
