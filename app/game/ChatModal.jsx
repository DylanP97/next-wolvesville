"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useGame } from "./GameProvider";
import { useTranslation } from "react-i18next";
import { replacePlaceholders } from "../lib/utils";
import { useDevMode } from "../providers/DevModeProvider";
import Chatbox from "./Chatbox";
import { useAuth } from "../providers/AuthProvider";

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
  const { isDev } = useAuth();

  const { t } = useTranslation();
  const [messages, setMessages] = useState(usedChat.history);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const isAtBottom = useRef(true);

  // Check if user is at the bottom
  const checkIfAtBottom = () => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const threshold = 50; // pixels from bottom
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  // Handle user scroll
  const handleScroll = () => {
    if (containerRef.current) {
      isAtBottom.current = checkIfAtBottom();
    }
  };

  // Auto-scroll to bottom ONLY if user is already at the bottom
  useEffect(() => {
    if (containerRef.current && isAtBottom.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Scroll to bottom when modal opens
  useEffect(() => {
    if (isOpen && containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
          isAtBottom.current = true;
        }
      }, 0);
    }
  }, [isOpen]);

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

  const filteredMessages = useMemo(() => {
    if (isDevMode && isDev) {
      return messages;
    }
    return messages.filter((msg) => {
      const messageText = msg.msg || "";
      return !messageText.includes("DEV --");
    });
  }, [messages, isDevMode, isDev]);

  // Reverse so oldest is at top, newest at bottom
  const displayMessages = useMemo(() => {
    return [...filteredMessages].reverse();
  }, [filteredMessages]);

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
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-grow overflow-y-auto p-4 bg-slate-900/50 space-y-3"
          >
            {displayMessages.length === 0 ? (
              <div className="text-sm italic text-slate-500 text-center mt-8">
                {usedChat.type === "general" && t("game.emptyGeneralChat")}
                {usedChat.type === "wolves" && t("game.emptyWolvesChat")}
                {usedChat.type === "jail" && t("game.emptyJailChat")}
              </div>
            ) : (
              displayMessages.map((msg, index) => {
                // Last message (newest at bottom) should be highlighted
                const isNewest = index === displayMessages.length - 1;

                if (msg.author) {
                  // User message - chat bubble style
                  const isOwnMessage = msg.author === clientPlayer.name;

                  return (
                    <div
                      key={index + "msg"}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`max-w-[80%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        {/* Author name */}
                        {!isOwnMessage && (
                          <div className="text-xs text-slate-400 mb-1 ml-2 font-semibold">
                            {msg.author}
                          </div>
                        )}

                        {/* Message bubble */}
                        <div className={`
                          rounded-2xl px-4 py-2 shadow-md
                          ${isOwnMessage
                            ? 'bg-blue-600 text-white rounded-tr-sm'
                            : 'bg-slate-700 text-slate-100 rounded-tl-sm'
                          }
                          ${isNewest && 'ring-2 ring-blue-400/50'}
                        `}>
                          <p className="text-sm break-words">
                            {replacePlaceholders(msg.msg)}
                          </p>
                        </div>

                        {/* Timestamp */}
                        <div className={`text-xs text-slate-500 mt-1 ${isOwnMessage ? 'text-right mr-2' : 'ml-2'}`}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const containsSkull = replacePlaceholders(msg.msg)?.includes("💀");

                  // System message - left style
                  return (
                    <div key={index + "msg"} className={`flex justify-left animate-fade-in ${isNewest && 'opacity-100'}`}>
                      <div className={`max-w-[85%] rounded-lg px-4 py-2 border ${containsSkull ? 'bg-red-700 border-red-500/50' : 'bg-slate-800/70 border-slate-700/50'} ${isNewest && 'ring-2 ring-blue-400/30 shadow-lg shadow-blue-500/20'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 text-xs">{msg.time}</span>
                          <span className="text-slate-300 text-xs">
                            {replacePlaceholders(msg.msg)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          {clientPlayer.isAlive && (
            <div className="h-40 border-t border-slate-700 bg-slate-800 rounded-b-lg p-3">
              <Chatbox />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatModal;