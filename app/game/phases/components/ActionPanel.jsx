"use client";

import { useMemo, useState } from "react";
import { useGame } from "../../GameProvider";
import { useAuth } from "../../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import SelectionCarousel from "./SelectionCarousel";
import i18n from "../../../lib/i18n";

/**
 * ActionPanel - Shows role-specific actions based on phase and role
 */
const ActionPanel = () => {
  const { t } = useTranslation();
  const { socket } = useAuth();
  const {
    clientPlayer,
    playersList,
    aliveList,
    gameId,
    timeOfTheDay,
    dayCount,
    selectionState,
    selectionHelpers,
  } = useGame();

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const role = clientPlayer?.role;
  const roleName = role?.name;
  const isWolf = role?.team === "Werewolves";
  const isAlive = clientPlayer?.isAlive;
  const isUnderArrest = clientPlayer?.isUnderArrest;
  const isAftermath = timeOfTheDay?.includes("Aftermath");

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
              targets: [], // No selection needed
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
      default:
        socket.emit("registerAction", payload, gameId);
    }

    selectionHelpers.startSelection(currentAction.type, currentAction.emoji);
    selectionHelpers.addPlayer(player);
    selectionHelpers.complete(currentAction.type);
    setSelectedPlayer(player);
  };

  // Handle no-selection actions (like Captain assert duty)
  const handleNoSelectionAction = () => {
    if (!currentAction || isActionDone) return;

    if (currentAction.type === "assertDuty") {
      socket.emit("assertDuty", { captainName: clientPlayer.name }, gameId);
      selectionHelpers.complete("assertDuty");
    }

    if (currentAction.type === "burn") {
      socket.emit("burnThemDown", { type: "burn", pyroId: clientPlayer.id }, gameId);
      selectionHelpers.complete("burn");
    }
  };

  // No action available
  if (!currentAction) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900/50">
        <div className="text-5xl mb-4">💤</div>
        <p className="text-slate-400 text-center">
          {!isAlive
            ? (t("game.youAreDead") || "You are dead...")
            : (t("game.noActionAvailable") || "No action available")
          }
        </p>
      </div>
    );
  }

  // Action done
  if (isActionDone) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900/50">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-green-400 text-center font-medium">
          {currentAction.emoji} {currentAction.label} {t("game.done") || "done"}
        </p>
        {selectedPlayer && (
          <p className="text-slate-400 text-sm mt-2">
            Target: {selectedPlayer.name}
          </p>
        )}
      </div>
    );
  }

  // No selection needed (Captain duty, Arsonist burn)
  if (currentAction.noSelection || (currentAction.canBurn && currentAction.type === "burn")) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900/50">
        <button
          onClick={handleNoSelectionAction}
          className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-xl text-white font-bold text-xl shadow-lg active:scale-95 transition-all"
        >
          {currentAction.emoji} {currentAction.label}
        </button>

        {/* Arsonist can also pour instead of burn */}
        {currentAction.canBurn && (
          <div className="mt-6">
            <p className="text-slate-400 text-sm mb-2">{t("game.orSelectToPour") || "Or select someone to pour gasoline:"}</p>
            <SelectionCarousel
              players={currentAction.targets}
              onSelect={handleAction}
              actionEmoji="⛽"
              actionLabel={t("game.tooltip.pour") || "Pour"}
            />
          </div>
        )}
      </div>
    );
  }

  // Selection needed
  return (
    <div className="flex-1 flex flex-col p-4 bg-slate-900/50">
      <div className="text-center mb-4">
        <span className="text-3xl">{currentAction.emoji}</span>
        <h2 className="text-white font-bold text-lg mt-1">{currentAction.label}</h2>
        <p className="text-slate-400 text-sm">
          {t("game.selectTarget") || "Select a target"}
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <SelectionCarousel
          players={currentAction.targets}
          onSelect={handleAction}
          actionEmoji={currentAction.emoji}
          actionLabel={currentAction.label}
        />
      </div>
    </div>
  );
};

export default ActionPanel;
