"use client";

import { useState, useEffect, useRef } from "react";
import { useGame } from "../GameProvider";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import PhaseHeader from "./components/PhaseHeader";
import Chatbox from "../ActionBar/Chatbox";
import { replacePlaceholders } from "../../lib/utils";

/**
 * DayPhaseView - Day discussion phase (chat-focused)
 * Shows: Chat + day actions (Gunner, Seer, Jailer arrest, etc.)
 */
const DayPhaseView = () => {
  const { t } = useTranslation();
  const { socket } = useAuth();
  const {
    general,
    clientPlayer,
    playersList,
    gameId,
    selectionState,
    selectionHelpers,
    dayCount,
  } = useGame();

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [general?.history]);

  // Get day actions for current role
  const getDayActions = () => {
    const actions = [];
    const role = clientPlayer?.role;

    if (!role || !clientPlayer.isAlive) return actions;

    // Captain - Assert Duty
    if (role.name === "Captain" && role.canPerform1?.nbrLeftToPerform > 0) {
      actions.push({
        label: t("game.tooltip.assertDuty") || "Reveal as Captain",
        emoji: "👔",
        action: () => socket.emit("assertDuty", clientPlayer.name, gameId),
        noSelection: true,
      });
    }

    // Gunner - Shoot
    if (role.name === "Gunner" && role.canPerform1?.nbrLeftToPerform > 0) {
      actions.push({
        label: `${t("game.tooltip.shoot") || "Shoot"} (${role.canPerform1.nbrLeftToPerform})`,
        emoji: "🔫",
        actionType: "shoot",
      });
    }

    // Seer - Reveal (if day action)
    if (role.name === "Seer" && role.canPerform1?.actionTime === "daytime") {
      actions.push({
        label: t("game.tooltip.reveal") || "Reveal",
        emoji: "👁️",
        actionType: "reveal",
      });
    }

    // Jailer - Arrest
    if (role.name === "Jailer" && role.canPerform1?.actionTime === "daytime") {
      actions.push({
        label: t("game.tooltip.arrest") || "Arrest",
        emoji: "👮",
        actionType: "arrest",
      });
    }

    // Nightmare Werewolf - Put Nightmare
    if (role.name === "Nightmare Werewolf" && role.canPerform1?.nbrLeftToPerform > 0) {
      actions.push({
        label: t("game.tooltip.nightmare") || "Nightmare",
        emoji: "😱",
        actionType: "putNightmare",
      });
    }

    return actions;
  };

  const dayActions = getDayActions();
  const messages = [...(general?.history || [])].reverse();

  const handleActionClick = (action) => {
    if (action.noSelection) {
      action.action();
    } else {
      selectionHelpers.toggle(action.actionType, action.emoji);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PhaseHeader
        title={`${t("game.daytime") || "Day"} ${dayCount}`}
        emoji="☀️"
        subtitle={t("game.tooltip.discuss") || "Discuss with the village"}
      />

      {/* Chat messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-900/50"
      >
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 italic mt-8">
            {t("game.emptyGeneralChat")}
          </div>
        ) : (
          messages.map((msg, index) => {
            if (msg.author) {
              const isOwn = msg.author === clientPlayer.name;
              return (
                <div key={index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    <div className={`text-xs text-slate-400 mb-1 ${isOwn ? 'text-right mr-2' : 'ml-2'}`}>
                      {msg.author}
                    </div>
                    <div className={`
                      rounded-2xl px-4 py-2 shadow-md
                      ${isOwn ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-700 text-slate-100 rounded-tl-sm'}
                    `}>
                      <p className="text-sm break-words">{replacePlaceholders(msg.msg)}</p>
                    </div>
                    <div className={`text-xs text-slate-500 mt-1 ${isOwn ? 'text-right mr-2' : 'ml-2'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            } else {
              // System message
              const hasSkull = replacePlaceholders(msg.msg)?.includes("💀");
              return (
                <div key={index} className="flex justify-center">
                  <div className={`
                    rounded-lg px-4 py-2 text-xs
                    ${hasSkull ? 'bg-red-700/50 text-red-200' : 'bg-slate-800/70 text-slate-300'}
                  `}>
                    {msg.time} - {replacePlaceholders(msg.msg)}
                  </div>
                </div>
              );
            }
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      {clientPlayer?.isAlive && (
        <div className="border-t border-slate-700 bg-slate-800 p-3">
          <Chatbox />
        </div>
      )}

      {/* Day actions */}
      {dayActions.length > 0 && (
        <div className="border-t border-slate-700 bg-slate-800 px-3 py-2">
          <div className="flex gap-2 overflow-x-auto">
            {dayActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                disabled={selectionHelpers.isActionBlocked(action.actionType)}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm
                  transition-all active:scale-95
                  ${selectionState.actionType === action.actionType
                    ? 'bg-yellow-500 text-black'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span className="mr-1">{action.emoji}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selection mode indicator */}
      {selectionState.mode !== 'idle' && selectionState.mode !== 'completed' && (
        <div className="bg-yellow-500 text-black text-center py-2 text-sm font-medium">
          {selectionState.actionEmoji} Select a player to {selectionState.actionType}
        </div>
      )}
    </div>
  );
};

export default DayPhaseView;
