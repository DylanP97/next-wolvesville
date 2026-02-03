"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useGame } from "../GameProvider";
import { useTranslation } from "react-i18next";
import { replacePlaceholders } from "../../lib/utils";
import { useDevMode } from "../../providers/DevModeProvider";
import Chatbox from "./Chatbox";
import { useAuth } from "../../providers/AuthProvider";
import { useKeyboardHeight } from "./useKeyboardHeight";

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

    const [messages, setMessages] = useState([]);
    const containerRef = useRef(null);
    const expandedContainerRef = useRef(null);
    const isAtBottom = useRef(true);
    const prevMessageCount = useRef(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const keyboardHeight = useKeyboardHeight();

    // Initialize messages when usedChat becomes available
    useEffect(() => {
        if (usedChat?.history) {
            setMessages(usedChat.history);
        }
    }, [usedChat]);

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
        if (!usedChat) return;
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
    }, [general, wolves, jail, medium, usedChat]);

    const filteredMessages = useMemo(() => {
        if (isDevMode && isDev) return messages;
        return messages.filter((msg) => !(msg.msg || "").includes("DEV --"));
    }, [messages, isDevMode, isDev]);

    const displayMessages = useMemo(() => {
        return [...filteredMessages].reverse();
    }, [filteredMessages]);

    useEffect(() => {
        const ref = isExpanded ? expandedContainerRef.current : containerRef.current;
        if (!ref) return;

        const shouldScroll =
            isAtBottom.current ||
            displayMessages.length > prevMessageCount.current;

        if (shouldScroll) {
            ref.scrollTop = ref.scrollHeight;
            isAtBottom.current = true;
        }

        prevMessageCount.current = displayMessages.length;
    }, [displayMessages, isExpanded]);

    useEffect(() => {
        const ref = isExpanded ? expandedContainerRef.current : containerRef.current;
        if (ref && usedChat) {
            ref.scrollTop = ref.scrollHeight;
            isAtBottom.current = true;
            prevMessageCount.current = displayMessages.length;
        }
    }, [usedChat?.type, displayMessages.length, isExpanded]);

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

    const handleChatFocus = () => setIsExpanded(true);
    const handleChatBlur = () => setTimeout(() => setIsExpanded(false), 150);
    const handleCloseExpanded = () => {
        setIsExpanded(false);
        document.activeElement?.blur();
    };

    // Guard: wait for usedChat to be initialized (after all hooks)
    if (!usedChat) {
        return null;
    }

    const renderChatTabs = (pillStyle) => (
        <div className={`flex ${pillStyle ? "gap-2 p-2" : "border-b border-slate-700 bg-slate-800"}`}>
            {availableChats.map((chat) => (
                <button
                    key={chat.type}
                    onClick={() => selectChat(chat.type)}
                    className={
                        pillStyle
                            ? `px-3 py-1.5 text-xs rounded-full transition-all ${
                                chat.type === usedChat.type
                                    ? "bg-blue-600 text-white font-bold"
                                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            }`
                            : `flex-1 py-2 px-3 text-xs transition-all ${
                                chat.type === usedChat.type
                                    ? "bg-blue-600 text-white font-bold border-b-2 border-blue-400"
                                    : "text-slate-300 hover:bg-slate-700"
                            }`
                    }
                >
                    {chat.emoji} {chat.label}
                </button>
            ))}
        </div>
    );

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
                        // User message - styled like system messages but with author name
                        return (
                            <div key={index + "msg"} className={`flex justify-left animate-fade-in ${isNewest && "opacity-100"}`}>
                                <div className={`max-w-[85%] rounded-lg px-4 py-2 border bg-slate-800/70 border-slate-700/50 ${isNewest && "ring-2 ring-blue-400/30 shadow-lg shadow-blue-500/20"}`}>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-slate-500 text-xs">{msg.time}</span>
                                        <span className="text-blue-400 text-xs font-semibold">{msg.author}:</span>
                                        <span className="text-slate-200 text-xs">
                                            {replacePlaceholders(msg.msg)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // System message (no author)
                    const containsSkull = replacePlaceholders(msg.msg)?.includes("\u{1F480}");
                    const containsEye = replacePlaceholders(msg.msg)?.includes("\u{1F441}\u{FE0F}");

                    return (
                        <div
                            key={index + "msg"}
                            className={`flex justify-left animate-fade-in ${isNewest && "opacity-100"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-lg px-4 py-2 border ${containsSkull
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

    // Expanded full-screen overlay
    if (isExpanded) {
        return (
            <>
                {/* Keep compact container in DOM but hidden so it doesn't unmount */}
                <div className="hidden">
                    <div ref={containerRef} />
                </div>

                {/* Full-screen overlay */}
                <div
                    className="fixed inset-0 z-50 bg-slate-900 flex flex-col"
                    style={{
                        paddingBottom: keyboardHeight > 0 ? `${keyboardHeight}px` : undefined,
                    }}
                >
                    {/* Header: chat tabs as pills + close button */}
                    <div className="flex items-center justify-between bg-slate-800 border-b border-slate-700">
                        <div className="flex-1 overflow-x-auto">
                            {renderChatTabs(true)}
                        </div>
                        <button
                            onClick={handleCloseExpanded}
                            className="px-3 py-2 text-slate-400 hover:text-white text-lg font-bold"
                            aria-label="Close chat"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages: flex-grow overflow-y-auto */}
                    <div
                        ref={expandedContainerRef}
                        onScroll={handleScroll}
                        className="flex-grow overflow-y-auto p-3 space-y-2 bg-slate-950/60"
                    >
                        {renderMessages()}
                    </div>

                    {/* Input: pinned at bottom */}
                    {(clientPlayer.isAlive || (usedChat.type === "medium" && !clientPlayer.isAlive)) && (
                        <div className="p-2 border-t border-slate-700 bg-slate-900">
                            <Chatbox onFocus={handleChatFocus} onBlur={handleChatBlur} autoFocus={true} />
                        </div>
                    )}
                </div>
            </>
        );
    }

    // Compact mode (default)
    return (
        <div className="bg-slate-900 border-t border-slate-700 transition-all duration-300">
            {renderChatTabs(false)}

            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="h-40 overflow-y-auto p-2 space-y-2 bg-slate-950/60"
            >
                {renderMessages()}
            </div>

            {(clientPlayer.isAlive || (usedChat.type === "medium" && !clientPlayer.isAlive)) && (
                <div className="p-1 border-t border-slate-700 bg-slate-900">
                    <Chatbox onFocus={handleChatFocus} onBlur={handleChatBlur} />
                </div>
            )}
        </div>
    );
}
