"use client";

import { useEffect, useState, useRef } from "react";
import CmdSend from "./CmdSend";
import { useGame } from "../GameProvider";
import { useAuth } from "../../providers/AuthProvider";
import { useInGameKeys } from "../InGameKeysProvider";
import { useTranslation } from "react-i18next";
import i18n from "../../lib/i18n";
import { useAnimation } from "../../providers/AnimationProvider";

const Chatbox = ({ onFocus, onBlur, autoFocus }) => {
  const { socket, username } = useAuth();
  const { timeOfTheDay, gameId, clientPlayer, isWolf, isJailer, isMedium, usedChat, isPrisoner } = useGame();
  const { triggerSimpleMessage } = useAnimation();
  const [message, setMessage] = useState("");
  const { t } = useTranslation();
  const textareaRef = useRef(null);

  // Auto-focus when autoFocus prop changes to true (for mobile overlay)
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

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
          isMedium,
          i18n.language === "fr" ? "fr" : "en"
        );
        setMessage(""); // Vider le textarea après envoi
      } else {
        triggerSimpleMessage("Vous ne pouvez pas envoyer un message vide...");
      }
    } else {
      triggerSimpleMessage("Vous ne pouvez pas parler... vous êtes mort...");
    }
  };

  // Gérer la touche Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Empêcher le saut à la ligne
      sendMessage(message);
    }
  };


  // Guard: wait for usedChat to be initialized
  if (!usedChat) {
    return null;
  }

  // Show "go back to sleep" only for general chat at night
  // Medium chat, wolves chat, and jail chat should work at night
  if (usedChat.type === "general" && timeOfTheDay === "nighttime") {
    return (
      <div className="flex justify-center items-center text-sm text-slate-300 italic h-8 sm:h-10">
        <p>{t("game.goBackToSleep")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2 w-full items-stretch">
      <textarea
        ref={textareaRef}
        placeholder={t("game.writeMessage")}
        value={message}
        className="h-8 sm:h-10 outline-none border-none p-2 flex-grow text-sm text-black rounded-lg resize-none"
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        rows={1}
      />
      <CmdSend sendMessage={sendMessage} message={message} />
    </div>
  );
};

export default Chatbox;