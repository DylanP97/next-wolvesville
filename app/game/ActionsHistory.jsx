"use client";

import { useGame } from "./GameProvider";
import Image from "next/image";
import daytime from "../../public/game/day-time.png";
import votetime from "../../public/game/vote-time.png";
import nighttime from "../../public/game/night-time.png";
import { useTranslation } from "react-i18next";
import { replacePlaceholders } from "../lib/utils";
import { useEffect, useState } from "react";

const ActionsHistory = () => {
  const {
    generalChat,
    wolvesChat,
    jailChat,
    timeOfTheDay,
    isWolf,
    isJailer,
    isUnderArrest,
    hasHandcuffed,
    clientPlayer,
  } = useGame();
  const { t } = useTranslation();

  const timeOfDayImages = {
    nighttime,
    votetime,
    daytime,
  };

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
  const [messages, setMessages] = useState(usedChat.history);

  useEffect(() => {
    if (timeOfTheDay == "nighttime" && isWolf) {
      availableChats.push(wolves);
      setUsedChat(wolves);
    } else if (
      (clientPlayer.isAlive && isUnderArrest) ||
      (clientPlayer.isAlive &&
        isJailer &&
        timeOfTheDay == "nighttime" &&
        hasHandcuffed > 0)
    ) {
      availableChats.push(jail);
      setUsedChat(jail);
    } else {
      setUsedChat(general);
    }
  }, [timeOfTheDay, generalChat, wolvesChat, jailChat]);

  const availableChats = [general];

  const selectChat = (type) => {
    switch (type) {
      case "general":
        setUsedChat(general);
        break;
      case "wolves":
        setUsedChat(wolves);
        break;
      case "jail":
        setUsedChat(jail);
        break;
      default:
        setUsedChat(general);
        break;
    }
  };

  useEffect(() => {
    setMessages(usedChat.history); // Update messages when the chat changes
  }, [usedChat.history]);

  return (
    <div
      className={`w-full z-10 relative overflow-hidden flex flex-col flex-grow min-h-[220px] bg-black`}
    >
      <div className="flex justify-center items-start w-full h-12 bg-gray-300">
        {availableChats.map((chat, index) => {
          return (
            <div
              className={`${
                chat.type === usedChat.type ? "bg-gray-500" : "bg-black"
              } flex justify-center items-center cursor-pointer h-full px-4`}
              key={"chattab-" + index}
              onClick={() => selectChat(chat.type)}
            >
              <h2 className="text-white text-sm">
                {chat.label} {chat.emoji}
              </h2>
            </div>
          );
        })}
      </div>
      <div className="z-10 p-2 object-bottom overflow-y-auto max-h-80">
        <ul className="actions-list text-white text-sm">
          {messages.map((msg, index) => {
            if (msg.author) {
              return (
                <li
                  key={index + "msg"}
                  datatype={index + "msg"}
                  className={`text-sm z-20 ${index == 0 && "font-bold"}`}
                >
                  {msg.time} -- {msg.author}: {replacePlaceholders(msg.msg)}
                </li>
              );
            }
            return (
              <li
                className={`text-sm z-20 ${index == 0 && "font-bold"}`}
                key={index + "msg"}
              >
                {msg.time} - {replacePlaceholders(msg.msg)}
              </li>
            );
          })}
        </ul>
      </div>
      <Image
        src={timeOfDayImages[timeOfTheDay]}
        alt="bg-time"
        width={130}
        height={130}
        priority
        style={{ height: "auto", width: "auto" }}
        className="m-2 absolute bottom-[0px] right-[-60px] opacity-30 z-0"
      />
    </div>
  );
};

export default ActionsHistory;
