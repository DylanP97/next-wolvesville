"use client";

import { useMemo, useState } from "react";
import { useGame } from "../GameProvider";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import i18n from "../../lib/i18n";
import TimerBar from "./components/TimerBar";
import PlayerList from "./components/PlayerList";
import ChatPanel from "./components/ChatPanel";
import SpecialOverlay from "./components/SpecialOverlay";

/**
 * GameLayout - Main game layout with unified player grid for display AND selection
 */
const GameLayout = () => {
  const { t } = useTranslation();
  const { socket } = useAuth();
  const {
    clientPlayer,
    playersList,
    aliveList,
    gameId,
    timeOfTheDay,
    dayCount,
    isUnderArrest,
    selectionHelpers,
    wolves,
    jail,
    medium,
  } = useGame();

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const role = clientPlayer?.role;
  const roleName = role?.name;
  const isWolf = role?.team === "Werewolves";
  const isAlive = clientPlayer?.isAlive;
  const isAftermath = timeOfTheDay?.includes("Aftermath");

  // Determine current phase info
  const phaseInfo = useMemo(() => {
    switch (timeOfTheDay) {
      case "daytime":
        return { name: t("game.daytime") || "Day", emoji: "☀️", color: "from-amber-500 to-orange-500" };
      case "votetime":
      case "votetimeAftermath":
        return { name: t("game.votetime") || "Vote", emoji: "🗳️", color: "from-red-500 to-rose-500" };
      case "nighttime":
      case "nighttimeAftermath":
        return { name: t("game.nighttime") || "Night", emoji: "🌙", color: "from-indigo-600 to-purple-600" };
      default:
        return { name: "Game", emoji: "🎮", color: "from-slate-600 to-slate-700" };
    }
  }, [timeOfTheDay, t]);

  // Get available action for current phase
  const currentAction = useMemo(() => {
    if (!isAlive || isUnderArrest || isAftermath) return null;

    // Vote time - everyone can vote
    if (timeOfTheDay === "votetime") {
      return {
        type: "vote",
        emoji: "🗳️",
        label: t("game.vote") || "Vote",
        targets: aliveList.filter(p => p.id !== clientPlayer.id),
      };
    }

    // Day time actions
    if (timeOfTheDay === "daytime") {
      switch (roleName) {
        case "Gunner":
          if (role.canPerform1?.nbrLeftToPerform > 0) {
            return {
              type: "shoot",
              emoji: "🔫",
              label: t("game.tooltip.shoot") || "Shoot",
              targets: aliveList.filter(p => p.id !== clientPlayer.id),
            };
          }
          break;
        case "Seer":
          if (role.canPerform1?.nbrLeftToPerform > 0 && role.canPerform1?.actionTime === "daytime") {
            return {
              type: "reveal",
              emoji: "👁️",
              label: t("game.tooltip.reveal") || "Reveal",
              targets: aliveList.filter(p => p.id !== clientPlayer.id && !p.isRevealed),
            };
          }
          break;
        case "Jailer":
          if (role.canPerform1?.nbrLeftToPerform > 0) {
            return {
              type: "arrest",
              emoji: "👮",
              label: t("game.tooltip.arrest") || "Arrest",
              targets: aliveList.filter(p => p.id !== clientPlayer.id && !p.isUnderArrest),
            };
          }
          break;
        case "Captain":
          if (!clientPlayer.hasAssertedDuty) {
            return {
              type: "assertDuty",
              emoji: "👑",
              label: t("game.tooltip.assertDuty") || "Assert Duty",
              targets: [],
              noSelection: true,
            };
          }
          break;
      }
    }

    // Night time actions
    if (timeOfTheDay === "nighttime") {
      // Wolf vote
      if (isWolf) {
        return {
          type: "wolfVote",
          emoji: "🐺",
          label: t("game.tooltip.kill") || "Kill",
          targets: aliveList.filter(p => p.role?.team !== "Werewolves" && !p.isUnderArrest),
        };
      }

      switch (roleName) {
        case "Seer":
          return {
            type: "reveal",
            emoji: "👁️",
            label: t("game.tooltip.reveal") || "Reveal",
            targets: aliveList.filter(p => p.id !== clientPlayer.id && !p.isRevealed),
          };

        case "Doctor":
          return {
            type: "heal",
            emoji: "💉",
            label: t("game.tooltip.heal") || "Heal",
            targets: aliveList.filter(p => p.id !== clientPlayer.id),
          };

        case "Witch":
          if (role.canPerform1?.nbrLeftToPerform > 0) {
            return {
              type: "protectPotion",
              emoji: "🧪",
              label: t("game.tooltip.protect") || "Protect",
              targets: aliveList.filter(p => p.id !== clientPlayer.id),
            };
          }
          if (role.canPerform2?.nbrLeftToPerform > 0) {
            return {
              type: "poisonPotion",
              emoji: "☠️",
              label: t("game.tooltip.poison") || "Poison",
              targets: aliveList.filter(p => p.id !== clientPlayer.id),
            };
          }
          break;

        case "Medium":
          if (role.canPerform1?.nbrLeftToPerform > 0) {
            const deadPlayers = playersList.filter(p => !p.isAlive);
            return {
              type: "revive",
              emoji: "✨",
              label: t("game.tooltip.revive") || "Revive",
              targets: deadPlayers,
            };
          }
          break;

        case "Grave Robber":
          const lootableGraves = playersList.filter(p => !p.isAlive && !p.graveLooted);
          return {
            type: "loot",
            emoji: "🪦",
            label: t("game.tooltip.loot") || "Loot",
            targets: lootableGraves,
          };

        case "Cupid":
          if (dayCount === 0 && role.canPerform1?.nbrLeftToPerform > 0) {
            return {
              type: "link",
              emoji: "💘",
              label: t("game.tooltip.link") || "Link",
              targets: aliveList.filter(p => p.id !== clientPlayer.id),
              selectTwo: true,
            };
          }
          break;

        case "Jailer":
          if (clientPlayer?.hasHandcuffed && role.canPerform2?.nbrLeftToPerform > 0) {
            const prisoner = playersList.find(p => p.isUnderArrest);
            return {
              type: "execute",
              emoji: "⚔️",
              label: t("game.tooltip.execute") || "Execute",
              targets: prisoner ? [prisoner] : [],
            };
          }
          break;

        case "Serial Killer":
          return {
            type: "murder",
            emoji: "🔪",
            label: t("game.tooltip.kill") || "Kill",
            targets: aliveList.filter(p => p.id !== clientPlayer.id && !p.isUnderArrest),
          };

        case "Arsonist":
          const markedCount = playersList.filter(p => p.isMarkedWithGasoline).length;
          return {
            type: markedCount >= 2 ? "burn" : "pour",
            emoji: markedCount >= 2 ? "🔥" : "⛽",
            label: markedCount >= 2 ? (t("game.tooltip.burn") || "Burn") : (t("game.tooltip.pour") || "Pour"),
            targets: aliveList.filter(p => p.id !== clientPlayer.id && !p.isMarkedWithGasoline),
            canBurn: markedCount >= 2,
          };

        case "Ghost Lady":
          return {
            type: "ghostVisit",
            emoji: "👻",
            label: t("game.tooltip.visit") || "Visit",
            targets: aliveList.filter(p => p.id !== clientPlayer.id && !p.isUnderArrest),
          };

        case "Wolf Seer":
          if (role.canPerform1?.nbrLeftToPerform > 0) {
            return {
              type: "uncoverRole",
              emoji: "🔍",
              label: t("game.tooltip.uncover") || "Uncover",
              targets: aliveList.filter(p => !p.isRevealedByWolfSeer && !p.isRevealed && p.id !== clientPlayer.id),
            };
          }
          break;

        case "Baby Werewolf":
          if (role.canPerform1?.nbrLeftToPerform > 0) {
            return {
              type: "chooseRevenge",
              emoji: "👶",
              label: t("game.tooltip.revenge") || "Revenge",
              targets: aliveList.filter(p => p.role?.team !== "Werewolves"),
            };
          }
          break;
      }
    }

    return null;
  }, [isAlive, isUnderArrest, isAftermath, timeOfTheDay, roleName, role, isWolf, aliveList, playersList, clientPlayer, dayCount, t]);

  // Check if action already done
  const isActionDone = currentAction && selectionHelpers.isActionBlocked(currentAction.type);

  // Handle action execution
  const handleAction = (player) => {
    if (!currentAction || isActionDone) return;

    const payload = {
      type: currentAction.type,
      playerId: clientPlayer.id,
      selectedPlayerId: player.id,
      selectedPlayerName: player.name,
    };

    // Emit the appropriate socket event
    switch (currentAction.type) {
      case "vote":
        socket.emit("addVote", {
          playerName: clientPlayer.name,
          ...payload,
          nbr: roleName === "Captain" && clientPlayer.hasAssertedDuty ? 3 : 1,
        }, gameId);
        break;
      case "wolfVote":
        socket.emit("addWolfVote", {
          playerName: clientPlayer.name,
          ...payload,
          nbr: roleName === "Alpha Werewolf" ? 2 : 1,
        }, gameId);
        break;
      case "shoot":
        socket.emit("shootBullet", { ...payload, gunnerId: clientPlayer.id }, gameId);
        break;
      case "reveal":
        socket.emit("revealPlayer", { ...payload, seerId: clientPlayer.id, selectedPlayerRole: player.role?.name }, gameId);
        break;
      case "arrest":
        socket.emit("arrestPlayer", { ...payload, jailerId: clientPlayer.id }, gameId);
        break;
      case "heal":
        socket.emit("heal", payload, gameId);
        break;
      case "protectPotion":
      case "poisonPotion":
        socket.emit(currentAction.type, payload, gameId);
        break;
      case "revive":
        socket.emit("revive", payload, gameId);
        break;
      case "loot":
        socket.emit("lootGrave", { ...payload, graveRobberId: clientPlayer.id, selectedPlayerRole: player.role }, gameId);
        break;
      case "execute":
        socket.emit("executePrisoner", { ...payload, killerId: clientPlayer.id }, gameId);
        break;
      case "murder":
        socket.emit("registerAction", { ...payload, type: "murder", killerId: clientPlayer.id }, gameId);
        break;
      case "pour":
        socket.emit("pourGasoline", { ...payload, pyroId: clientPlayer.id }, gameId);
        break;
      case "ghostVisit":
        socket.emit("ghostVisit", { ghostLadyId: clientPlayer.id, ...payload }, gameId);
        break;
      case "uncoverRole":
        socket.emit("uncoverRole", { wolfSeerId: clientPlayer.id, ...payload }, gameId);
        break;
      case "chooseRevenge":
        socket.emit("chooseJuniorWolfDeathRevenge", { babyWolfId: clientPlayer.id, ...payload }, gameId);
        break;
      case "gossip":
        socket.emit("gossip", { ...payload, playerName: clientPlayer.name }, gameId);
        break;
      default:
        socket.emit("registerAction", payload, gameId);
    }

    selectionHelpers.startSelection(currentAction.type, currentAction.emoji);
    selectionHelpers.addPlayer(player);
    if (currentAction.type !== "gossip") {
      selectionHelpers.complete(currentAction.type);
    } else {
      selectionHelpers.resetToIdle();
    }
    setSelectedPlayer(player);
  };

  // Handle no-selection actions (Captain assert duty, Arsonist burn)
  const handleNoSelectionAction = () => {
    if (!currentAction || isActionDone) return;

    if (currentAction.type === "assertDuty") {
      socket.emit("assertDuty", { captainName: clientPlayer.name }, gameId);
      selectionHelpers.complete("assertDuty");
    }

    if (currentAction.type === "burn" || currentAction.canBurn) {
      socket.emit("burnThemDown", { type: "burn", pyroId: clientPlayer.id }, gameId);
      selectionHelpers.complete("burn");
    }
  };

  // Determine what chat is available
  const availableChat = useMemo(() => {
    if (!isAlive && roleName !== "Medium") return null;

    // Day/Vote time - general chat
    if (timeOfTheDay === "daytime" || timeOfTheDay === "votetime") {
      if (isUnderArrest) return null;
      return { type: "general", label: t("game.chat") || "Chat" };
    }

    // Night time - special chats
    if (timeOfTheDay === "nighttime" || timeOfTheDay === "nighttimeAftermath") {
      if (isUnderArrest) return { type: "jail", label: t("game.jailChat") || "Jail", data: jail };
      if (isWolf) return { type: "wolves", label: t("game.wolvesChat") || "Wolves", data: wolves };
      if (roleName === "Jailer" && clientPlayer?.hasHandcuffed) {
        return { type: "jail", label: t("game.jailChat") || "Jail", data: jail };
      }
      if (roleName === "Medium") return { type: "medium", label: t("game.mediumChat") || "Spirits", data: medium };
    }

    return null;
  }, [timeOfTheDay, isAlive, isUnderArrest, isWolf, roleName, clientPlayer, wolves, jail, medium, t]);

  // Check for special situation overlays
  const specialSituation = useMemo(() => {
    if (clientPlayer?.willHaveNightmares && (timeOfTheDay === "nighttime" || timeOfTheDay === "nighttimeAftermath")) {
      return "nightmare";
    }
    if (isUnderArrest && (timeOfTheDay === "nighttime" || timeOfTheDay === "nighttimeAftermath")) {
      return "jail";
    }
    if (!isAlive && roleName !== "Medium") {
      return "dead";
    }
    return null;
  }, [clientPlayer, isUnderArrest, isAlive, roleName, timeOfTheDay]);

  const displayRoleName = i18n.language === "fr" ? role?.nameFR : role?.name;

  // Render action status bar
  const renderActionStatus = () => {
    if (isActionDone) {
      return (
        <div className="bg-green-900/50 border-b border-green-700 px-4 py-3 flex items-center justify-center gap-3">
          <span className="text-2xl">✅</span>
          <span className="text-green-300 font-medium">
            {currentAction.emoji} {currentAction.label} {t("game.done") || "done"}
          </span>
          {selectedPlayer && (
            <span className="text-green-400 text-sm">→ {selectedPlayer.name}</span>
          )}
        </div>
      );
    }

    if (currentAction?.noSelection || currentAction?.canBurn) {
      return (
        <div className="bg-amber-900/50 border-b border-amber-700 px-4 py-3 flex items-center justify-center gap-3">
          <button
            onClick={handleNoSelectionAction}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-lg text-white font-bold shadow-lg active:scale-95 transition-all"
          >
            {currentAction.emoji} {currentAction.label}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Timer Bar */}
      <TimerBar
        phase={phaseInfo}
        dayCount={dayCount}
        roleName={displayRoleName}
        roleImage={role?.image}
      />

      {/* Action Status Bar */}
      {renderActionStatus()}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Special Overlay (nightmare, jail, dead) */}
        {specialSituation ? (
          <SpecialOverlay
            type={specialSituation}
            chat={specialSituation === "jail" ? availableChat : null}
          />
        ) : (
          <>
            {/* Player List with integrated selection */}
            <div className="flex-1 overflow-y-auto">
              <PlayerList
                selectionTargets={currentAction?.targets || []}
                onSelect={!isActionDone && currentAction && !currentAction.noSelection ? handleAction : null}
                actionEmoji={currentAction?.emoji}
                actionLabel={currentAction?.label}
                isActionDone={isActionDone}
              />
            </div>

            {/* Chat Panel */}
            {availableChat && (
              <div className="flex-shrink-0 h-48 border-t border-slate-700">
                <ChatPanel chatConfig={availableChat} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GameLayout;
