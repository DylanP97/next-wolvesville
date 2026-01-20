"use client";

import { useEffect, useRef } from "react";
import { useGame } from "../../GameProvider";
import Chatbox from "../../ActionBar/Chatbox";
import { replacePlaceholders } from "../../../lib/utils";

/**
 * ChatPanel - Chat panel for different chat types (general, wolves, jail, medium)
 */
const ChatPanel = ({ chatConfig }) => {
  const { clientPlayer, messagesHistory } = useGame();
  const containerRef = useRef(null);

  // Get messages based on chat type
  const messages = chatConfig.type === "general"
    ? messagesHistory
    : (chatConfig.data?.history || []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Reverse messages to show newest at bottom (if not already)
  const displayMessages = [...(messages || [])].reverse();

  return (
    <div className="flex flex-col h-full bg-slate-800">
      {/* Chat header */}
      <div className="flex-shrink-0 px-3 py-2 bg-slate-700 border-b border-slate-600">
        <span className="text-white text-sm font-medium">{chatConfig.label}</span>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-2 space-y-2"
      >
        {displayMessages.length === 0 ? (
          <div className="text-center text-slate-500 italic text-sm mt-4">
            No messages yet...
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

      {/* Input */}
      {clientPlayer?.isAlive && (
        <div className="flex-shrink-0 border-t border-slate-600 p-2">
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
