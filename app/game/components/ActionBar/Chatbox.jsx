"use client";

import { useEffect, useState } from "react";
import CmdSend from "./PlayingCommands/CmdSend";
import { useGame } from "../../providers/GameProvider";
import { useAuth } from "../../../providers/AuthProvider";
import { useKeys } from "../../providers/KeysProvider";

const Chatbox = () => {
  const { socket, username } = useAuth();
  const { timeOfTheDay, gameId, clientPlayer, isWolf, isJailer } = useGame();
  const { currentKey, setCurrentKey } = useKeys();
  const [message, setMessage] = useState("");

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
      <>
        <input
          disabled={
            !timeOfTheDay == "nighttime" && (!isJailerChat || !isWolf) && false
          }
          placeholder="Write a message"
          value={message}
          className="outline-none border-none p-2 h-[60px] w-full text-black z-20"
          onChange={(e) => setMessage(e.target.value)}
        />
        <CmdSend sendMessage={sendMessage} message={message} />
      </>
    );
  }
};

export default Chatbox;
