"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGame } from "./GameProvider";
import { Tooltip } from "@nextui-org/react";

const ChatButton = ({ isChatOpen, setIsChatOpen }) => {
  const { general, wolves, jail, availableChats } = useGame();
  const { divActionIcon } = require("../lib/styles");
  const { t } = useTranslation();
  
  const [lastSeenCounts, setLastSeenCounts] = useState({
    general: 0,
    wolves: 0,
    jail: 0,
  });

  // Calculate total unread messages
  const unreadCount = availableChats.reduce((total, chat) => {
    const currentCount = chat.history.length;
    const lastSeen = lastSeenCounts[chat.type] || 0;
    return total + Math.max(0, currentCount - lastSeen);
  }, 0);

  // When chat is opened, mark all messages as read
  useEffect(() => {
    if (isChatOpen) {
      setLastSeenCounts({
        general: general.history.length,
        wolves: wolves.history.length,
        jail: jail.history.length,
      });
    }
  }, [isChatOpen, general.history.length, wolves.history.length, jail.history.length]);

  return (
    <Tooltip content={t("game.tooltip.seeOrWriteMessage")} color="secondary" variant="flat">
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`relative ${divActionIcon} ${isChatOpen ? "bg-blue-600 hover:bg-blue-800" : "bg-slate-900 hover:bg-slate-700"}`}
      >
        <span className="text-3xl">💬</span>

        {/* Unread badge */}
        {unreadCount > 0 && !isChatOpen && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </button>
    </Tooltip>
  );
};

export default ChatButton;