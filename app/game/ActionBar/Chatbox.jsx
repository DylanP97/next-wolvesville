"use client";

import { useEffect, useState } from "react";
import CmdSend from "./CmdSend";
import { useGame } from "../GameProvider";
import { useAuth } from "../../providers/AuthProvider";
import { useInGameKeys } from "../InGameKeysProvider";
import { useTranslation } from "react-i18next";
import i18n from "../../lib/i18n";
import { useAnimation } from "../../providers/AnimationProvider";

const Chatbox = () => {
  const { socket, username } = useAuth();
  const { timeOfTheDay, gameId, clientPlayer, isWolf, isJailer, isMedium, usedChat } = useGame();
  const { triggerSimpleMessage } = useAnimation();
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const sendMessage = (messageToSend) => {
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
        setMessage(""); // Vider le textarea après envoi
      } else {
        triggerSimpleMessage("Vous ne pouvez pas envoyer un message vide...");
      }
    } else {
      triggerSimpleMessage("Vous ne pouvez pas parler... vous êtes mort... rappelez-vous?");
    }
  };

  // Gérer la touche Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Empêcher le saut à la ligne
      sendMessage(message);
    }
  };

  // SUPPRIMÉ le useEffect avec currentKey qui causait le double envoi

  useEffect(() => {
    setMessage("");
  }, [timeOfTheDay]);

  if (usedChat.type === "general" && timeOfTheDay === "nighttime") {
    return (
      <div className="flex justify-center text-sm text-slate-300 italic"><p>{t("game.goBackToSleep")}</p></div>
    );
  } else {
    return (
      <div className="flex flex-row gap-2 w-full items-stretch">
        <textarea
          placeholder={t("game.writeMessage")}
          value={message}
          className="outline-none border-none p-3 flex-grow text-sm text-black rounded-lg resize-none"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <CmdSend sendMessage={sendMessage} message={message} />
      </div>
    );
  }
};

export default Chatbox;