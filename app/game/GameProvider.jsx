"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import cpuNextMove from "../lib/cpuNextMove";
import { useSound } from "../providers/SoundProvider";
import { useAnimation } from "../providers/AnimationProvider";
import { useTranslation } from "react-i18next";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { game, socket, username, updateUserGameState } = useAuth();
  const { generateNoise } = useSound();
  const { triggerAnimation } = useAnimation();
  const { t } = useTranslation();

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

  class Chat {
    constructor(type, label, history, emoji) {
      (this.type = type),
        (this.label = label),
        (this.history = history),
        (this.emoji = emoji);
    }
  }

  const general = new Chat("general", t("game.generalChat"), generalChat, "🏘️");
  const wolves = new Chat("wolves", t("game.wolvesChat"), wolvesChat, "🐺");
  const jail = new Chat("jail", t("game.jailChat"), jailChat, "👮‍♂️");

  const [usedChat, setUsedChat] = useState(general);
  const [availableChats, setAvailableChats] = useState([general]);

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

    // Reset available chats state
    if (timeOfTheDay == "nighttime" && isWolf) {
      setAvailableChats([general, wolves]);
      setUsedChat(wolves);
    } else if (
      (clientPlayer.isAlive && isUnderArrest) ||
      (clientPlayer.isAlive &&
        isJailer &&
        timeOfTheDay == "nighttime" &&
        hasHandcuffed > 0)
    ) {
      setAvailableChats([general, jail]);
      setUsedChat(jail);
    } else {
      setAvailableChats([general]);
      setUsedChat(general);
    }
  }, [timeOfTheDay]);

  useEffect(() => {
    if (!isAlive) generateNoise("grunt");
  }, [isAlive]);

  const processedSecondRef = useRef(null);

  useEffect(() => {
    if (processedSecondRef.current === timeCounter) return; // Skip if already processed
    processedSecondRef.current = timeCounter; // Mark this second as processed
    if (game.createdBy === clientPlayer.name) {
      playersList.map((player) => {
        if (player.isCPU && player.isAlive && !player.isUnderArrest) {
          // console.log("cpu move before time", player.name, player.randomSecond);
          if (timeCounter === player.randomSecond) {
            console.log("cpu move", player.name, player.randomSecond);
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
        jail,
        wolves,
        general,
        isSelection,
        isDoubleSelection,
        isBlocked,
        setIsSelection,
        setIsDoubleSelection,
        setIsBlocked,
        actionType,
        setActionType,
        weather,
        usedChat,
        setUsedChat,
        availableChats,
        setAvailableChats
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
