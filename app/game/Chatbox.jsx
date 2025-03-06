"use client";

import { useEffect, useState } from "react";
import CmdSend from "./CmdSend";
import { useGame } from "./GameProvider";
import { useAuth } from "../providers/AuthProvider";
import { useInGameKeys } from "./InGameKeysProvider";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";
import { useAnimation } from "../providers/AnimationProvider";

const Chatbox = () => {
  const { socket, username } = useAuth();
  const { timeOfTheDay, gameId, clientPlayer, isWolf, isJailer } = useGame();
  const { currentKey, setCurrentKey } = useInGameKeys();
  const { triggerSimpleMessage } = useAnimation();
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const isJailerChat =
    clientPlayer.isUnderArrest ||
    (isJailer &&
      timeOfTheDay == "nighttime" &&
      clientPlayer.hasHandcuffed >= 0);
  const isWolvesChat = timeOfTheDay == "nighttime" && isWolf ? true : false;

  const sendMessage = (message) => {
    if (clientPlayer.isAlive) {
      if (message) {
        socket.emit(
          "sendMessage",
          message,
          gameId,
          username,
          isWolvesChat,
          isJailerChat,
          isJailer,
          i18n.language === "fr" ? "fr" : "en"
        );
        setMessage("");
      } else {
        triggerSimpleMessage("You can't send an empty message...");
      }
    } else {
      triggerSimpleMessage("You can speak... you're dead... remember?");
    }
  };

  useEffect(() => {
    if (currentKey == "Enter") {
      sendMessage(message);
      setCurrentKey(null);
      setMessage("");
    }
  }, [currentKey]);

  useEffect(() => {
    setMessage("");
  }, [timeOfTheDay]);

  if (!isWolf && !isJailerChat && timeOfTheDay === "nighttime") {
    return <></>;
  } else {
    return (
      <>
        <input
          disabled={
            !timeOfTheDay === "nighttime" && (!isJailerChat || !isWolf) && false
          }
          placeholder={t("game.writeMessage")}
          value={message}
          className="outline-none border-none p-1 flex flex-grow w-full text-xs text-black h-14"
          onChange={(e) => setMessage(e.target.value)}
        />
        <CmdSend sendMessage={sendMessage} message={message} />
      </>
    );
  }
};

export default Chatbox;
