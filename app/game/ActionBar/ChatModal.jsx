"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useGame } from "../GameProvider";
import { useTranslation } from "react-i18next";
import { replacePlaceholders } from "../../lib/utils";
import { useDevMode } from "../../providers/DevModeProvider";
import Chatbox from "./Chatbox";
import { useAuth } from "../../providers/AuthProvider";
import { useKeyboardHeight, useInputFocus } from "./useKeyboardHeight";

const ChatModal = ({ isOpen, setIsOpen, isSidebar = false }) => {
  const {
    general,
    wolves,
    jail,
    medium,
    usedChat,
    setUsedChat,
    availableChats,
    clientPlayer,
    playersList,
  } = useGame();
  const { isDevMode } = useDevMode();
  const { isDev } = useAuth();

  const { t } = useTranslation();
  const [messages, setMessages] = useState(usedChat.history);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const isAtBottom = useRef(true);

  // Gestion du clavier mobile
  const keyboardHeight = useKeyboardHeight();
  const { isInputFocused, handleFocus, handleBlur } = useInputFocus();

  const checkIfAtBottom = () => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const threshold = 50;
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  const handleScroll = () => {
    if (containerRef.current) {
      isAtBottom.current = checkIfAtBottom();
    }
  };

  useEffect(() => {
    if (containerRef.current && isAtBottom.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if ((isOpen || isSidebar) && containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
          isAtBottom.current = true;
        }
      }, 0);
    }
  }, [isOpen, isSidebar]);

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
      case "medium":
        setMessages(medium.history);
        break;
    }
  }, [general, wolves, jail, medium, usedChat.type]);

  const filteredMessages = useMemo(() => {
    if (isDevMode && isDev) {
      return messages;
    }
    return messages.filter((msg) => {
      const messageText = msg.msg || "";
      return !messageText.includes("DEV --");
    });
  }, [messages, isDevMode, isDev]);

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
      case "medium":
        setUsedChat(medium);
        break;
      default:
        setUsedChat(general);
        break;
    }
  };


  // Rendu des messages (même logique pour les deux modes)
  const renderMessages = () => (
    <>
      {displayMessages.length === 0 ? (
        <div className="text-sm italic text-slate-500 text-center mt-8">
          {usedChat.type === "general" && t("game.emptyGeneralChat")}
          {usedChat.type === "wolves" && t("game.emptyWolvesChat")}
          {usedChat.type === "jail" && t("game.emptyJailChat")}
          {usedChat.type === "medium" && t("game.emptyMediumChat")}
        </div>
      ) : (
        displayMessages.map((msg, index) => {
          const isNewest = index === displayMessages.length - 1;

          if (msg.author) {
            const isOwnMessage = msg.author === clientPlayer.name;
            const authorPlayer = playersList?.find(p => p.name === msg.author);
            const isAuthorJailer = authorPlayer?.role?.name === "Jailer";
            const isAuthorMedium = authorPlayer?.role?.name === "Medium";
            const shouldHideAuthor =
              (usedChat.type === "jail" && isAuthorJailer) ||
              (usedChat.type === "medium" && isAuthorMedium);

            return (
              <div
                key={index + "msg"}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`max-w-[80%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {!shouldHideAuthor && (
                    <div className={`text-xs text-slate-400 mb-1 font-semibold ${isOwnMessage ? 'text-right mr-2' : 'ml-2'}`}>
                      {msg.author}
                    </div>
                  )}

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

                  <div className={`text-xs text-slate-500 mt-1 ${isOwnMessage ? 'text-right mr-2' : 'ml-2'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          } else {
            const containsSkull = replacePlaceholders(msg.msg)?.includes("💀");
            const containsEye = replacePlaceholders(msg.msg)?.includes("👁️");

            return (
              <div key={index + "msg"} className={`flex justify-left animate-fade-in ${isNewest && 'opacity-100'}`}>
                <div className={`max-w-[85%] rounded-lg px-4 py-2 border ${containsSkull ? 'bg-red-700 border-red-500/50' : containsEye ? 'bg-green-700 border-green-500/50' : 'bg-slate-800/70 border-slate-700/50'} ${isNewest && 'ring-2 ring-blue-400/30 shadow-lg shadow-blue-500/20'}`}>
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
    </>
  );

  // Sidebar mode (desktop)
  if (isSidebar) {
    return (
      <div className="w-full h-full bg-slate-900 border-l-2 border-slate-700 shadow-2xl flex flex-col">
        {/* Chat tabs */}
        <div className="min-h-14 max-h-14 flex justify-center border-b border-slate-700 bg-slate-800">
          {availableChats.map((chat, index) => (
            <div
              className={`${chat.type === usedChat.type ? "bg-blue-600 border-b-2 border-blue-400" : "bg-transparent hover:bg-slate-700"} cursor-pointer px-4 flex items-center transition-all`}
              key={"chattab-" + index}
              onClick={() => selectChat(chat.type)}
            >
              <h2 className={`${chat.type === usedChat.type ? "text-white font-bold" : "text-slate-300"} text-xs`}>
                {chat.emoji} {chat.label}
              </h2>
            </div>
          ))}
        </div>

        {/* Messages */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-grow overflow-y-auto p-2 bg-slate-900/50 space-y-2"
        >
          {renderMessages()}
        </div>

        {/* Chat input */}
        {(clientPlayer.isAlive || (usedChat.type === "medium" && !clientPlayer.isAlive)) && (
          <div className="h-20 border-t border-slate-700 bg-slate-800 p-3">
            <Chatbox />
          </div>
        )}
      </div>
    );
  }

  // Modal mode (mobile) - avec gestion du clavier
  const modalStyle = keyboardHeight > 0 && isInputFocused
    ? {
      height: `calc(100vh + ${keyboardHeight}px)`,
      bottom: 0,
      top: 'auto',
      transition: 'height 0.3s ease-out'
    }
    : {};

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div
          className="fixed inset-2 md:inset-auto md:bottom-4 md:right-4 md:w-[500px] md:h-[600px] z-50 bg-slate-900 border-2 border-slate-700 rounded-lg shadow-2xl flex flex-col"
          style={modalStyle}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-slate-400 hover:text-white text-xl z-10"
          >
            ✕
          </button>

          <div className="min-h-14 max-h-14 flex justify-center border-b border-slate-700 bg-slate-800 rounded-t-lg flex-shrink-0">
            {availableChats.map((chat, index) => (
              <div
                className={`${chat.type === usedChat.type ? "bg-blue-600 border-b-2 border-blue-400" : "bg-transparent hover:bg-slate-700"} cursor-pointer px-4 flex items-center transition-all`}
                key={"chattab-" + index}
                onClick={() => selectChat(chat.type)}
              >
                <h2 className={`${chat.type === usedChat.type ? "text-white font-bold" : "text-slate-300"} text-xs`}>
                  {chat.emoji} {chat.label}
                </h2>
              </div>
            ))}
          </div>

          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-grow overflow-y-auto p-2 bg-slate-900/50 space-y-2 min-h-0"
          >
            {renderMessages()}
          </div>

          {(clientPlayer.isAlive || (usedChat.type === "medium" && !clientPlayer.isAlive)) && (
            <div className="h-20 border-t border-slate-700 bg-slate-800 rounded-b-lg p-3 flex-shrink-0">
              <div onFocus={handleFocus} onBlur={handleBlur}>
                <Chatbox />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatModal;