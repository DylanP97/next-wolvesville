"use client";

import { useState } from "react";
import { useGame } from "../GameProvider";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import i18n from "../../lib/i18n";
import { useAnimation } from "../../providers/AnimationProvider";

/**
 * Chatbox - Modern styled chat input with send button
 */
const Chatbox = () => {
  const { socket, username } = useAuth();
  const { timeOfTheDay, gameId, clientPlayer, isJailer, usedChat } = useGame();
  const { triggerSimpleMessage } = useAnimation();
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useTranslation();

  const sendMessage = (messageToSend) => {
    if (!usedChat) return;

    // Allow sending messages if alive OR if dead but using medium chat
    const canSendMessage = clientPlayer.isAlive || (usedChat.type === "medium" && !clientPlayer.isAlive);

    if (canSendMessage) {
      if (messageToSend && messageToSend.trim()) {
        socket.emit(
          "sendMessage",
          messageToSend,
          gameId,
          username,
          usedChat.type === "wolves",
          usedChat.type === "jail",
          usedChat.type === "medium",
          isJailer,
          i18n.language === "fr" ? "fr" : "en"
        );
        setMessage("");
      } else {
        triggerSimpleMessage(t("game.emptyMessage") || "You cannot send an empty message...");
      }
    } else {
      triggerSimpleMessage(t("game.cannotSpeak") || "You cannot speak... you are dead...");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(message);
    }
  };

  const handleSendClick = () => {
    sendMessage(message);
  };

  // Guard: wait for usedChat to be initialized
  if (!usedChat) {
    return null;
  }

  // Show "go back to sleep" only for general chat at night (non read-only)
  if (usedChat.type === "general" && timeOfTheDay === "nighttime" && !usedChat.readOnly) {
    return (
      <div className="flex justify-center items-center text-sm text-slate-400 italic py-2">
        <span className="mr-2">🌙</span>
        <p>{t("game.goBackToSleep") || "It's night, go back to sleep..."}</p>
      </div>
    );
  }

  const hasContent = message.trim().length > 0;

  return (
    <div className={`
      flex items-center gap-2 p-1.5 rounded-xl transition-all duration-200
      ${isFocused
        ? 'bg-slate-700 ring-2 ring-blue-500/50'
        : 'bg-slate-700/50 hover:bg-slate-700'
      }
    `}>
      {/* Input */}
      <input
        type="text"
        placeholder={t("game.writeMessage") || "Write a message..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="
          flex-1 bg-transparent text-white text-sm placeholder-slate-400
          px-3 py-1.5 outline-none min-w-0
        "
      />

      {/* Send button */}
      <button
        onClick={handleSendClick}
        disabled={!hasContent}
        className={`
          flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
          ${hasContent
            ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
            : 'bg-slate-600/50 text-slate-500 cursor-not-allowed'
          }
        `}
        title={t("game.sendMessage") || "Send message"}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </div>
  );
};

export default Chatbox;
