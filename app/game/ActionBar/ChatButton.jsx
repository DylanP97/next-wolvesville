"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGame } from "../GameProvider";
import { Tooltip } from "@nextui-org/react";
import { useDevMode } from "../../providers/DevModeProvider";
import { useAuth } from "../../providers/AuthProvider";

const ChatButton = ({ isChatOpen, setIsChatOpen }) => {
  const { general, wolves, jail, medium, availableChats } = useGame();
  const { isDevMode } = useDevMode();
  const { isDev } = useAuth();
  const { divActionIcon } = require("../../lib/styles");
  const { t } = useTranslation();
  
  const [lastSeenCounts, setLastSeenCounts] = useState({
    general: 0,
    wolves: 0,
    jail: 0,
    medium: 0,
  });

  // Filter function for non-DEV messages
  const filterNonDevMessages = (messages) => {
    if (isDevMode && isDev) {
      return messages;
    }
    return messages.filter((msg) => {
      const messageText = msg.msg || "";
      return !messageText.includes("DEV --");
    });
  };

  // Get filtered message counts
  const filteredCounts = useMemo(() => ({
    general: filterNonDevMessages(general.history).length,
    wolves: filterNonDevMessages(wolves.history).length,
    jail: filterNonDevMessages(jail.history).length,
    medium: filterNonDevMessages(medium.history).length,
  }), [general.history, wolves.history, jail.history, medium.history, isDevMode, isDev]);

  // Calculate total unread messages (excluding DEV messages)
  const unreadCount = availableChats.reduce((total, chat) => {
    const currentCount = filteredCounts[chat.type];
    const lastSeen = lastSeenCounts[chat.type] || 0;
    return total + Math.max(0, currentCount - lastSeen);
  }, 0);

  // When chat is opened, mark all messages as read
  useEffect(() => {
    if (isChatOpen) {
      setLastSeenCounts({
        general: filteredCounts.general,
        wolves: filteredCounts.wolves,
        jail: filteredCounts.jail,
        medium: filteredCounts.medium,
      });
    }
  }, [isChatOpen, filteredCounts]);

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
            {unreadCount > 20 ? '20+' : unreadCount}
          </div>
        )}
      </button>
    </Tooltip>
  );
};

export default ChatButton;