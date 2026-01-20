"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useGame } from "../GameProvider";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import PhaseHeader from "./components/PhaseHeader";
import PlayerListItem from "./components/PlayerListItem";
import Chatbox from "../ActionBar/Chatbox";
import { replacePlaceholders } from "../../lib/utils";
import i18n from "../../lib/i18n";

/**
 * NightPhaseView - Night phase with role-specific actions
 * Handles: Wolf vote, Seer reveal, Doctor heal, Serial Killer kill, etc.
 */
const NightPhaseView = () => {
  const { t } = useTranslation();
  const { socket } = useAuth();
  const {
    clientPlayer,
    playersList,
    aliveList,
    gameId,
    selectionState,
    selectionHelpers,
    dayCount,
    wolves,
    jail,
    medium,
    isUnderArrest,
    timeOfTheDay,
  } = useGame();

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const role = clientPlayer?.role;
  const roleName = role?.name;
  const isWolf = role?.team === "Werewolves";
  const isJailer = roleName === "Jailer";
  const isMedium = roleName === "Medium";
  const isAftermath = timeOfTheDay === "nighttimeAftermath";

  // Determine night chat based on role
  const nightChat = useMemo(() => {
    if (isWolf && !isUnderArrest) return wolves;
    if (isJailer && clientPlayer?.hasHandcuffed) return jail;
    if (isMedium) return medium;
    if (isUnderArrest) return jail;
    return null;
  }, [isWolf, isJailer, isMedium, isUnderArrest, wolves, jail, medium, clientPlayer]);

  // Scroll chat to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [nightChat?.history]);

  // Get night action config based on role name (matching CPU logic)
  const getNightAction = () => {
    if (!role || !clientPlayer?.isAlive || isUnderArrest) return null;

    // Check for nightmares blocking action
    if (clientPlayer?.willHaveNightmares) return null;

    switch (roleName) {
      // Village roles
      case "Seer":
        return { type: "reveal", emoji: "👁️", label: t("game.tooltip.reveal") || "Reveal" };

      case "Doctor":
        return { type: "heal", emoji: "💉", label: t("game.tooltip.heal") || "Heal" };

      case "Witch":
        if (role.canPerform1?.nbrLeftToPerform > 0) {
          return { type: "protectPotion", emoji: "🧪", label: t("game.tooltip.protect") || "Protect" };
        }
        if (role.canPerform2?.nbrLeftToPerform > 0) {
          return { type: "poisonPotion", emoji: "☠️", label: t("game.tooltip.poison") || "Poison" };
        }
        return null;

      case "Medium":
        if (role.canPerform1?.nbrLeftToPerform > 0) {
          return { type: "revive", emoji: "✨", label: t("game.tooltip.revive") || "Revive", targetDead: true };
        }
        return null;

      case "Grave Robber":
        return { type: "loot", emoji: "🪦", label: t("game.tooltip.loot") || "Loot", targetDead: true };

      case "Cupid":
        if (dayCount === 0 && role.canPerform1?.nbrLeftToPerform > 0) {
          return { type: "link", emoji: "💘", label: t("game.tooltip.link") || "Link Lovers", selectTwo: true };
        }
        return null;

      case "Jailer":
        if (clientPlayer?.hasHandcuffed && role.canPerform2?.nbrLeftToPerform > 0) {
          return { type: "execute", emoji: "⚔️", label: t("game.tooltip.execute") || "Execute", targetPrisoner: true };
        }
        return null;

      // Solo roles - they ALWAYS have actions
      case "Serial Killer":
        return { type: "murder", emoji: "🔪", label: t("game.tooltip.kill") || "Kill" };

      case "Arsonist":
        // Check if any players are marked with gasoline
        const markedCount = playersList.filter(p => p.isMarkedWithGasoline).length;
        if (markedCount >= 2) {
          // Can choose to burn or pour more
          return { type: "arsonChoice", emoji: "🔥", label: t("game.tooltip.burn") || "Burn / Pour", hasBurnOption: true };
        }
        return { type: "pour", emoji: "⛽", label: t("game.tooltip.pour") || "Pour Gasoline" };

      case "Ghost Lady":
        return { type: "ghostVisit", emoji: "👻", label: t("game.tooltip.visit") || "Visit" };

      // Wolf roles with special abilities
      case "Wolf Seer":
        if (role.canPerform1?.nbrLeftToPerform > 0) {
          return { type: "uncoverRole", emoji: "🔍", label: t("game.tooltip.uncover") || "Uncover Role" };
        }
        return null;

      case "Baby Werewolf":
        if (role.canPerform1?.nbrLeftToPerform > 0) {
          return { type: "chooseRevenge", emoji: "👶", label: t("game.tooltip.revenge") || "Choose Revenge Target" };
        }
        return null;

      // No night action
      case "Fool":
      case "Villager":
      case "Cursed":
      case "Captain":
      case "Gunner":
        return null;

      default:
        return null;
    }
  };

  const nightAction = getNightAction();
  const hasNightAction = nightAction && !selectionHelpers.isActionBlocked(nightAction.type);

  // Get valid targets based on action type
  const getTargets = () => {
    if (!nightAction) return [];

    if (nightAction.targetDead) {
      return playersList.filter(p => !p.isAlive && !p.graveLooted);
    }
    if (nightAction.targetPrisoner) {
      return playersList.filter(p => p.isUnderArrest);
    }

    // Default: alive players excluding self
    return aliveList.filter(p => {
      if (p.id === clientPlayer.id) return false;
      // Wolves can't target other wolves (except Doctor healing)
      if (isWolf && p.role?.team === "Werewolves" && nightAction.type !== "heal") return false;
      // Can't target arrested players
      if (p.isUnderArrest) return false;
      return true;
    });
  };

  // Wolf vote targets (non-wolves only)
  const wolfTargets = useMemo(() => {
    if (!isWolf || isUnderArrest) return [];
    return aliveList.filter(p => p.role?.team !== "Werewolves" && !p.isUnderArrest);
  }, [aliveList, isWolf, isUnderArrest]);

  // Handle night action
  const handleAction = (player) => {
    if (!nightAction || selectionHelpers.isActionBlocked(nightAction.type)) return;

    const payload = {
      type: nightAction.type,
      playerId: clientPlayer.id,
      selectedPlayerId: player.id,
      selectedPlayerName: player.name,
    };

    // Role-specific emit
    switch (nightAction.type) {
      case "reveal":
        socket.emit("revealPlayer", { ...payload, seerId: clientPlayer.id }, gameId);
        break;
      case "heal":
        socket.emit("heal", payload, gameId);
        break;
      case "protectPotion":
      case "poisonPotion":
        socket.emit(nightAction.type, payload, gameId);
        break;
      case "revive":
        socket.emit("revive", payload, gameId);
        break;
      case "loot":
        socket.emit("lootGrave", { ...payload, graveRobberId: clientPlayer.id, selectedPlayerRole: player.role }, gameId);
        break;
      case "ghostVisit":
        socket.emit("ghostVisit", { ghostLadyId: clientPlayer.id, ...payload }, gameId);
        break;
      case "pour":
        socket.emit("pourGasoline", { ...payload, pyroId: clientPlayer.id }, gameId);
        break;
      case "murder":
        socket.emit("registerAction", { ...payload, type: "murder", killerId: clientPlayer.id }, gameId);
        break;
      case "execute":
        socket.emit("executePrisoner", { ...payload, killerId: clientPlayer.id }, gameId);
        break;
      case "uncoverRole":
        socket.emit("uncoverRole", { wolfSeerId: clientPlayer.id, ...payload }, gameId);
        break;
      case "chooseRevenge":
        socket.emit("chooseJuniorWolfDeathRevenge", { babyWolfId: clientPlayer.id, ...payload }, gameId);
        break;
      default:
        socket.emit("registerAction", payload, gameId);
    }

    selectionHelpers.startSelection(nightAction.type, nightAction.emoji);
    selectionHelpers.addPlayer(player);
    selectionHelpers.complete(nightAction.type);
  };

  // Handle burn action for Arsonist
  const handleBurn = () => {
    socket.emit("burnThemDown", { type: "burn", pyroId: clientPlayer.id }, gameId);
    selectionHelpers.startSelection("burn", "🔥");
    selectionHelpers.complete("burn");
  };

  // Handle wolf vote
  const handleWolfVote = (player) => {
    if (selectionHelpers.isActionBlocked('wolfVote')) return;

    const nbr = roleName === "Alpha Werewolf" ? 2 : 1;

    socket.emit("addWolfVote", {
      playerId: clientPlayer.id,
      playerName: clientPlayer.name,
      selectedPlayerId: player.id,
      selectedPlayerName: player.name,
      nbr,
    }, gameId);

    selectionHelpers.startSelection('wolfVote', '🐺');
    selectionHelpers.addPlayer(player);
    selectionHelpers.complete('wolfVote');
  };

  // Render chat messages
  const renderChat = () => {
    if (!nightChat) return null;

    const messages = [...(nightChat.history || [])].reverse();

    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-900/30"
        >
          {messages.length === 0 ? (
            <div className="text-center text-slate-500 italic mt-4 text-sm">
              {nightChat.type === "wolves" && t("game.emptyWolvesChat")}
              {nightChat.type === "jail" && t("game.emptyJailChat")}
              {nightChat.type === "medium" && t("game.emptyMediumChat")}
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.author === clientPlayer.name ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-1.5 text-sm
                  ${msg.author === clientPlayer.name ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-100'}
                  ${!msg.author ? 'bg-slate-800/70 text-slate-400 text-xs' : ''}
                `}>
                  {msg.author && <span className="text-xs opacity-70 block">{msg.author}</span>}
                  {replacePlaceholders(msg.msg)}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {clientPlayer?.isAlive && (
          <div className="border-t border-slate-700 bg-slate-800 p-2">
            <Chatbox />
          </div>
        )}
      </div>
    );
  };

  // Render based on role type
  const renderContent = () => {
    // Dead player - just show sleep (unless Medium)
    if (!clientPlayer?.isAlive && !isMedium) {
      return renderSleepView();
    }

    // Under arrest - show jail chat only
    if (isUnderArrest) {
      return (
        <div className="flex-1 flex flex-col">
          <div className="bg-orange-500/20 border-b border-orange-500/30 px-4 py-2 text-center">
            <p className="text-orange-200 text-sm">👮 {t("game.tooltip.underArrest") || "You are under arrest"}</p>
          </div>
          {renderChat()}
        </div>
      );
    }

    // Wolf - show wolf vote + chat
    if (isWolf) {
      const hasWolfVoted = selectionHelpers.isActionBlocked('wolfVote');
      const votedForId = selectionState.completedActions?.wolfVote?.[0];

      // Also check for special wolf abilities (Wolf Seer, Baby Werewolf)
      const hasSpecialAction = hasNightAction && !isAftermath;

      return (
        <div className="flex-1 flex flex-col">
          {/* Special wolf action if available */}
          {hasSpecialAction && (
            <div className="bg-purple-500/20 border-b border-purple-500/30 px-4 py-2 text-center">
              <p className="text-purple-200 text-sm">
                {nightAction.emoji} {nightAction.label}
              </p>
            </div>
          )}

          {/* Wolf targets */}
          <div className="flex-1 overflow-y-auto bg-slate-900/50">
            {wolfTargets.map(player => (
              <PlayerListItem
                key={player.id}
                player={player}
                voteCount={player.wolfVoteAgainst || 0}
                isLeading={(player.wolfVoteAgainst || 0) > 0 && player.wolfVoteAgainst === Math.max(...wolfTargets.map(p => p.wolfVoteAgainst || 0))}
                isSelected={votedForId === player.id}
                showRole={player.isRevealed}
                onAction={!hasWolfVoted && !isAftermath ? handleWolfVote : null}
                actionLabel={t("game.tooltip.kill") || "Kill"}
                actionEmoji="🐺"
                disabled={hasWolfVoted || isAftermath}
              />
            ))}
          </div>

          {/* Wolf chat */}
          <div className="h-48 border-t border-slate-700">
            {renderChat()}
          </div>
        </div>
      );
    }

    // Role with night action
    if (hasNightAction && !isAftermath) {
      const targets = getTargets();
      const actionDone = selectionHelpers.isActionBlocked(nightAction.type);
      const selectedId = selectionState.completedActions?.[nightAction.type]?.[0];

      return (
        <div className="flex-1 flex flex-col">
          <div className="bg-purple-500/20 border-b border-purple-500/30 px-4 py-2 text-center">
            <p className="text-purple-200 text-sm">
              {nightAction.emoji} {nightAction.label}
            </p>
            {nightAction.hasBurnOption && (
              <button
                onClick={handleBurn}
                disabled={selectionHelpers.isActionBlocked("burn")}
                className="mt-2 px-4 py-1 bg-red-600 hover:bg-red-500 rounded text-white text-sm disabled:opacity-50"
              >
                🔥 {t("game.tooltip.burn") || "Burn Them All!"}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-900/50">
            {targets.length === 0 ? (
              <div className="text-center text-slate-500 italic mt-8">
                {nightAction.targetDead
                  ? (t("game.noDeadPlayers") || "No dead players to target")
                  : (t("game.noValidTargets") || "No valid targets")
                }
              </div>
            ) : (
              targets.map(player => (
                <PlayerListItem
                  key={player.id}
                  player={player}
                  isSelected={selectedId === player.id}
                  showRole={player.isRevealed || nightAction.targetDead}
                  onAction={!actionDone ? handleAction : null}
                  actionLabel={nightAction.label}
                  actionEmoji={nightAction.emoji}
                  disabled={actionDone}
                />
              ))
            )}
          </div>

          {/* Medium/Jailer chat */}
          {(isMedium || isJailer) && nightChat && (
            <div className="h-40 border-t border-slate-700">
              {renderChat()}
            </div>
          )}
        </div>
      );
    }

    // No action - sleep view
    return renderSleepView();
  };

  const renderSleepView = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/50 p-8">
      <div className="text-6xl mb-4">💤</div>
      <h2 className="text-white text-xl font-bold mb-2">
        {t("game.goBackToSleep") || "The night is dark..."}
      </h2>
      <p className="text-slate-400 text-center">
        {t("game.tooltip.waitForDawn") || "Wait for dawn..."}
      </p>
    </div>
  );

  const displayRoleName = i18n.language === "fr" ? role?.nameFR : role?.name;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PhaseHeader
        title={isWolf ? t("game.wolvesChat") || "Wolf Vote" : `${t("game.nighttime") || "Night"} ${dayCount}`}
        emoji={isWolf ? "🐺" : "🌙"}
        subtitle={displayRoleName}
      />

      {renderContent()}
    </div>
  );
};

export default NightPhaseView;
