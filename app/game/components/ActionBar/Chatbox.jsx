"use client";

import { useEffect, useState } from "react";
import CmdSend from "./PlayingCommands/CmdSend";
import { useGame } from "../../providers/GameProvider";
import { useAuth } from "../../../providers/AuthProvider";
import { useInGameKeys } from "../../providers/InGameKeysProvider";
import { useTranslation } from "react-i18next";

const Chatbox = () => {
  const { socket, username } = useAuth();
  const { timeOfTheDay, gameId, clientPlayer, isWolf, isJailer } = useGame();
  const { currentKey, setCurrentKey } = useInGameKeys();
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const isJailerChat =
    clientPlayer.isUnderArrest ||
    (isJailer && timeOfTheDay == "nighttime" && clientPlayer.hasHandcuffed);
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
          isJailer
        );
        setMessage("");
      } else {
        console.log("rien n'est écrit");
      }
    } else {
      console.log("You're dead...");
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

  if (!isWolf && !isJailerChat && timeOfTheDay == "nighttime") {
    return <></>;
  } else {
    return (
      <div className="flex flex-row w-full">
        <input
          disabled={
            !timeOfTheDay == "nighttime" && (!isJailerChat || !isWolf) && false
          }
          placeholder={t("game.writeMessage")}
          value={message}
          className="outline-none border-none p-2 h-[80px] flex flex-grow w-full text-black z-20"
          onChange={(e) => setMessage(e.target.value)}
        />
        <CmdSend sendMessage={sendMessage} message={message} />
      </div>
    );
  }
};

export default Chatbox;
