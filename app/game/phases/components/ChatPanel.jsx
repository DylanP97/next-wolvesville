"use client";

import { useEffect, useRef, useMemo } from "react";
import { useGame } from "../../GameProvider";
import Chatbox from "../../ActionBar/Chatbox";
import { replacePlaceholders } from "../../../lib/utils";

/**
 * ChatPanel - Chat panel for different chat types (general, wolves, jail, medium)
 */
const ChatPanel = ({ chatConfig }) => {
  const { clientPlayer, generalChat } = useGame();
  const containerRef = useRef(null);
  const isAtBottomRef = useRef(true);

  // Get messages based on chat type - memoized to prevent unnecessary re-renders
  const messages = useMemo(() => {
    return chatConfig.type === "general"
      ? generalChat
      : (chatConfig.data?.history || []);
  }, [chatConfig.type, chatConfig.data?.history, generalChat]);

  // Track if user is at bottom of chat
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // Consider "at bottom" if within 50px of the bottom
      isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 50;
    }
  };

  // Only auto-scroll when user is already at bottom
  useEffect(() => {
    if (containerRef.current && isAtBottomRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Reverse messages to show newest at bottom (if not already)
  const displayMessages = [...(messages || [])].reverse();

  // Get emoji for chat type
  const chatEmoji = {
    general: "💬",
    wolves: "🐺",
    jail: "👮",
    medium: "🔮",
  }[chatConfig.type] || "💬";

  return (
    <div className="flex flex-col h-full bg-slate-900/80">
      {/* Chat header */}
      <div className="flex-shrink-0 px-4 py-2.5 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
        <span className="text-lg">{chatEmoji}</span>
        <span className="text-white text-sm font-medium">{chatConfig.label}</span>
      </div>

      {/* Messages - takes all available space */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0"
      >
        {displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <span className="text-3xl mb-2">{chatEmoji}</span>
            <p className="text-sm italic">No messages yet...</p>
          </div>
        ) : (
          displayMessages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg}
              isOwn={msg.author === clientPlayer?.name}
            />
          ))
        )}
      </div>

      {/* Input - fixed at bottom (hidden if read-only, shown for alive or medium chat) */}
      {!chatConfig.readOnly && (clientPlayer?.isAlive || chatConfig.type === "medium") && (
        <div className="flex-shrink-0 border-t border-slate-700 p-2 bg-slate-800">
          <Chatbox />
        </div>
      )}
    </div>
  );
};

/**
 * ChatMessage - Single chat message bubble
 */
const ChatMessage = ({ message, isOwn }) => {
  const isSystem = !message.author;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[85%] rounded-lg px-3 py-1.5 text-sm
          ${isSystem
            ? 'bg-slate-700/50 text-slate-400 text-xs italic'
            : isOwn
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-100'
          }
        `}
      >
        {!isSystem && message.author && (
          <span className="text-xs opacity-70 block">{message.author}</span>
        )}
        <span>{replacePlaceholders(message.msg)}</span>
      </div>
    </div>
  );
};

export default ChatPanel;
