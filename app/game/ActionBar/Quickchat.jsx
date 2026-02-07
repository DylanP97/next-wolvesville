"use client";

import { useMemo } from "react";
import { useGame } from "../GameProvider";
import i18n from "../../lib/i18n";
import quickchatMessages from "./quickchatMessages";

const Quickchat = ({ onSelectMessage }) => {
  const { timeOfTheDay, usedChat, clientPlayer } = useGame();

  const messages = useMemo(() => {
    if (!usedChat) return [];

    const chatType = usedChat.type;
    const result = [...(quickchatMessages.general || [])];

    // Add phase-specific messages
    if (chatType === "wolves") {
      result.push(...(quickchatMessages.wolves || []));
    } else if (chatType === "medium") {
      result.push(...(quickchatMessages.medium || []));
    } else if (timeOfTheDay === "daytime") {
      result.push(...(quickchatMessages.daytime || []));
    } else if (timeOfTheDay === "votetime") {
      result.push(...(quickchatMessages.votetime || []));
    }

    return result;
  }, [timeOfTheDay, usedChat]);

  // Hide quickchat for dead players on general chat, or nighttime general chat
  if (!clientPlayer?.isAlive && usedChat?.type === "general") return null;
  if (usedChat?.type === "general" && timeOfTheDay === "nighttime") return null;

  if (messages.length === 0) return null;

  const isFr = i18n.language === "fr";

  return (
    <div className="flex gap-1.5 overflow-x-auto py-1 px-1 scrollbar-hide">
      {messages.map((msg) => (
        <button
          key={msg.id}
          onClick={() => onSelectMessage(isFr ? msg.fr : msg.en)}
          className="flex-shrink-0 text-xs px-2 py-1 rounded-full bg-slate-700/60 hover:bg-slate-600 text-slate-300 hover:text-white border border-slate-600/50 transition-colors whitespace-nowrap"
        >
          {msg.emoji} {isFr ? msg.fr : msg.en}
        </button>
      ))}
    </div>
  );
};

export default Quickchat;
