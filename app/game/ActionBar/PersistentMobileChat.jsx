"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useGame } from "../GameProvider";
import { useTranslation } from "react-i18next";
import { replacePlaceholders } from "../../lib/utils";
import { useDevMode } from "../../providers/DevModeProvider";
import Chatbox from "./Chatbox";
import { useAuth } from "../../providers/AuthProvider";

export default function PersistentMobileChat() {
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
    const containerRef = useRef(null);
    const isAtBottom = useRef(true);
    const prevMessageCount = useRef(0);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

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
        if (isDevMode && isDev) return messages;
        return messages.filter((msg) => !(msg.msg || "").includes("DEV --"));
    }, [messages, isDevMode, isDev]);

    const displayMessages = useMemo(() => {
        return [...filteredMessages].reverse();
    }, [filteredMessages]);

    useEffect(() => {
        if (!containerRef.current) return;

        const shouldScroll =
            isAtBottom.current ||
            displayMessages.length > prevMessageCount.current;

        if (shouldScroll) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
            isAtBottom.current = true;
        }

        prevMessageCount.current = displayMessages.length;
    }, [displayMessages]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
            isAtBottom.current = true;
            prevMessageCount.current = displayMessages.length;
        }
    }, [usedChat.type]);

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
        }
    };

    useEffect(() => {
        const handleViewportChange = () => {
            if (!window.visualViewport) return;

            const vh = window.visualViewport.height;
            const full = window.innerHeight;

            // Most reliable keyboard detection pattern on iOS/Android 2024+
            const diff = Math.round(full - vh);

            // Ignore very small changes (navigation bar, etc)
            if (diff < 40) {
                setKeyboardHeight(0);
            } else {
                setKeyboardHeight(diff);
            }
        };

        const vvp = window.visualViewport;
        if (vvp) {
            vvp.addEventListener('resize', handleViewportChange);
            vvp.addEventListener('scroll', handleViewportChange);
        }

        window.addEventListener('resize', handleViewportChange);

        // Initial check
        handleViewportChange();

        return () => {
            if (vvp) {
                vvp.removeEventListener('resize', handleViewportChange);
                vvp.removeEventListener('scroll', handleViewportChange);
            }
            window.removeEventListener('resize', handleViewportChange);
        };
    }, []);

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
                        const authorPlayer = playersList?.find((p) => p.name === msg.author);
                        const isAuthorJailer = authorPlayer?.role?.name === "Jailer";
                        const isAuthorMedium = authorPlayer?.role?.name === "Medium";
                        const shouldHideAuthor =
                            (usedChat.type === "jail" && isAuthorJailer) ||
                            (usedChat.type === "medium" && isAuthorMedium);

                        return (
                            <div
                                key={index + "msg"}
                                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-fade-in`}
                            >
                                <div className={`max-w-[80%] ${isOwnMessage ? "order-2" : "order-1"}`}>
                                    {!shouldHideAuthor && (
                                        <div
                                            className={`text-xs text-slate-400 mb-1 font-semibold ${isOwnMessage ? "text-right mr-2" : "ml-2"
                                                }`}
                                        >
                                            {msg.author}
                                        </div>
                                    )}

                                    <div
                                        className={`
                      rounded-2xl px-4 py-2 shadow-md
                      ${isOwnMessage
                                                ? "bg-blue-600 text-white rounded-tr-sm"
                                                : "bg-slate-700 text-slate-100 rounded-tl-sm"}
                      ${isNewest && "ring-2 ring-blue-400/50"}
                    `}
                                    >
                                        <p className="text-sm break-words">{replacePlaceholders(msg.msg)}</p>
                                    </div>

                                    <div
                                        className={`text-xs text-slate-500 mt-1 ${isOwnMessage ? "text-right mr-2" : "ml-2"
                                            }`}
                                    >
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    const containsSkull = replacePlaceholders(msg.msg)?.includes("💀");
                    const containsEye = replacePlaceholders(msg.msg)?.includes("👁️");

                    return (
                        <div
                            key={index + "msg"}
                            className={`flex justify-left animate-fade-in ${isNewest && "opacity-100"}`}
                        >
                            <div
                                className={`rounded-lg px-4 py-1 border ${containsSkull
                                    ? "bg-red-700 border-red-500/50"
                                    : containsEye
                                        ? "bg-green-700 border-green-500/50"
                                        : "bg-slate-800/70 border-slate-700/50"
                                    } ${isNewest && "ring-2 ring-blue-400/30 shadow-lg shadow-blue-500/20"}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-300 text-xs">{msg.time}</span>
                                    <span className="text-slate-300 text-xs">
                                        {replacePlaceholders(msg.msg)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </>
    );

    return (
        <div
            className="bg-slate-900 border-t border-slate-700 transition-all duration-300"
            style={{
                paddingBottom: keyboardHeight ? `${keyboardHeight}px` : undefined,
                transition: keyboardHeight ? 'padding-bottom 0.22s ease-out' : 'none',
            }}
        >
            <div className="flex border-b border-slate-700 bg-slate-800">
                {availableChats.map((chat) => (
                    <button
                        key={chat.type}
                        onClick={() => selectChat(chat.type)}
                        className={`flex-1 py-2 px-3 text-xs transition-all ${chat.type === usedChat.type
                            ? "bg-blue-600 text-white font-bold border-b-2 border-blue-400"
                            : "text-slate-300 hover:bg-slate-700"
                            }`}
                    >
                        {chat.emoji} {chat.label}
                    </button>
                ))}
            </div>

            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="h-40 overflow-y-auto p-2 space-y-2 bg-slate-950/60"
            >
                {renderMessages()}
            </div>

            {(clientPlayer.isAlive || (usedChat.type === "medium" && !clientPlayer.isAlive)) && (
                <div className="p-1 border-t border-slate-700 bg-slate-900">
                    <Chatbox />
                </div>
            )}
        </div>
    );
}