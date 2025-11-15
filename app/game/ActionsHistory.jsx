"use client";

import { useGame } from "./GameProvider";
import { useTranslation } from "react-i18next";
import { replacePlaceholders } from "../lib/utils";
import { useDevMode } from "../providers/DevModeProvider";
import { useEffect, useState, useMemo } from "react";

const ActionsHistory = () => {
  const {
    general,
    wolves,
    jail,
    // timeOfTheDay,
    // isWolf,
    // isJailer,
    // isUnderArrest,
    // hasHandcuffed,
    // clientPlayer,
    usedChat,
    setUsedChat,
    availableChats,
    // setAvailableChats
  } = useGame();
  const { isDevMode } = useDevMode();
  const { t } = useTranslation();

  // class Chat {
  //   constructor(type, label, history, emoji) {
  //     (this.type = type),
  //       (this.label = label),
  //       (this.history = history),
  //       (this.emoji = emoji);
  //   }
  // }

  // const general = new Chat("general", t("game.generalChat"), generalChat, "🏘️");
  // const wolves = new Chat("wolves", t("game.wolvesChat"), wolvesChat, "🐺");
  // const jail = new Chat("jail", t("game.jailChat"), jailChat, "👮‍♂️");

  // const [usedChat, setUsedChat] = useState(general);
  const [messages, setMessages] = useState(usedChat.history);
  // const [availableChats, setAvailableChats] = useState([general]);

  // useEffect(() => {
  //   if (timeOfTheDay == "nighttime" && isWolf) {
  //     setAvailableChats([general, wolves]);
  //     setUsedChat(wolves);
  //   } else if (
  //     (clientPlayer.isAlive && isUnderArrest) ||
  //     (clientPlayer.isAlive &&
  //       isJailer &&
  //       timeOfTheDay == "nighttime" &&
  //       hasHandcuffed > 0)
  //   ) {
  //     setAvailableChats([general, jail]);
  //     setUsedChat(jail);
  //   } else {
  //     setAvailableChats([general]);
  //     setUsedChat(general);
  //   }
  // }, [timeOfTheDay]);

  useEffect(() => {
    switch (usedChat.type) {
      case "general":
        setMessages(general.history);
        break;
      case "wolves":
        setMessages(wolves.history);
        break;
      case "jail":
        setMessages(jail.history);
        break;
    }
  }, [general, wolves, jail, usedChat.type]);

  // Filter out DEV -- messages when dev mode is off
  const filteredMessages = useMemo(() => {
    if (isDevMode) {
      return messages;
    }
    return messages.filter((msg) => {
      const messageText = msg.msg || "";
      return !messageText.includes("DEV --");
    });
  }, [messages, isDevMode]);

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

  return (
    <div
      className={`w-full z-10 relative overflow-hidden flex flex-col max-h-fit`}
    >

      {/* header of the chat */}
      <div className="h-12 flex justify-center">
        {availableChats.map((chat, index) => {
          return (
            <>
              <div
                className={`${chat.type === usedChat.type ? "bg-slate-400 border-red-500" : "bg-transparent"} cursor-pointer px-4 flex items-center`}
                key={"chattab-" + index}
                onClick={() => selectChat(chat.type)}
              >
                <h2 className={`${chat.type === usedChat.type ? "text-black" : "text-white "} text-sm`}>
                  {chat.label} {chat.emoji}
                </h2>
              </div>
            </>
          );
        })}
      </div>

      {/* content of the chat */}
      <div className="bg-slate-400 z-10 p-2 object-bottom overflow-y-auto flex-grow max-h-40">
        <ul className="actions-list text-black text-sm">
          {filteredMessages.length === 0 ? (
            <li className="text-sm z-20 italic text-slate-600">
              {usedChat.type === "general" && t("game.emptyGeneralChat")}
              {usedChat.type === "wolves" && t("game.emptyWolvesChat")}
              {usedChat.type === "jail" && t("game.emptyJailChat")}
            </li>
          ) : (
            filteredMessages.map((msg, index) => {
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
            })
          )}
        </ul>
      </div>
      {/* <Image
        src={timeOfDayImages[timeOfTheDay]}
        alt="bg-time"
        width={130}
        height={130}
        priority
        style={{ height: "auto", width: "auto" }}
        className="m-2 absolute bottom-[0px] right-[-60px] opacity-30 z-0"
      /> */}
    </div>
  );
};

export default ActionsHistory;
