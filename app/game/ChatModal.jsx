"use client";

import { useState } from "react";
import { useGame } from "./GameProvider";
import { useTranslation } from "react-i18next";
import { replacePlaceholders } from "../lib/utils";
import { useDevMode } from "../providers/DevModeProvider";
import { useMemo } from "react";
import Chatbox from "./Chatbox";

const ChatModal = ({ isOpen, setIsOpen }) => {
  const {
    general,
    wolves,
    jail,
    usedChat,
    setUsedChat,
    availableChats,
    clientPlayer,
  } = useGame();
  const { isDevMode } = useDevMode();
  const { t } = useTranslation();
  const [messages, setMessages] = useState(usedChat.history);

  useMemo(() => {
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
    <>
      {isOpen && (
        <div className="fixed inset-0 md:inset-0 bottom-20 md:bottom-auto z-40 bg-black/30 backdrop-blur-none md:backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {isOpen && (
        <div className="fixed inset-2 md:inset-auto md:bottom-24 md:right-4 md:w-[500px] md:h-[600px] z-50 bg-slate-900 border-2 border-slate-700 rounded-lg shadow-2xl flex flex-col">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-slate-400 hover:text-white text-xl z-10"
          >
            ✕
          </button>

          {/* Chat tabs */}
          <div className="min-h-14 max-h-14 flex justify-center border-b border-slate-700 bg-slate-800 rounded-t-lg">
            {availableChats.map((chat, index) => {
              return (
                <div
                  className={`${chat.type === usedChat.type ? "bg-blue-600 border-b-2 border-blue-400" : "bg-transparent hover:bg-slate-700"} cursor-pointer px-4 flex items-center transition-all`}
                  key={"chattab-" + index}
                  onClick={() => selectChat(chat.type)}
                >
                  <h2 className={`${chat.type === usedChat.type ? "text-white font-bold" : "text-slate-300"} text-sm`}>
                    {chat.emoji} {chat.label}
                  </h2>
                </div>
              );
            })}
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 bg-slate-850">
            <ul className="actions-list text-white text-sm space-y-2">
              {filteredMessages.length === 0 ? (
                <li className="text-sm italic text-slate-500">
                  {usedChat.type === "general" && t("game.emptyGeneralChat")}
                  {usedChat.type === "wolves" && t("game.emptyWolvesChat")}
                  {usedChat.type === "jail" && t("game.emptyJailChat")}
                </li>
              ) : (
                filteredMessages.map((msg, index) => {
                  if (msg.author) {
                    return (
                      <li key={index + "msg"} className={`text-sm ${index === 0 && "font-bold text-blue-300"}`}>
                        <span className="text-slate-400">{msg.time}</span> <span className="text-slate-200 font-semibold">{msg.author}:</span> <span className="text-slate-100">{replacePlaceholders(msg.msg)}</span>
                      </li>
                    );
                  }
                  return (
                    <li key={index + "msg"} className={`text-sm text-slate-300 ${index === 0 && "font-bold text-blue-300"}`}>
                      <span className="text-slate-400">{msg.time}</span> - {replacePlaceholders(msg.msg)}
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          {/* Chat input only */}
          {clientPlayer.isAlive && (
            <div className="border-t border-slate-700 bg-slate-800 rounded-b-lg flex flex-row gap-2 p-2 h-32">
              <Chatbox />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatModal;


