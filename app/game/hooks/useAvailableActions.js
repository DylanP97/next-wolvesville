"use client";

import { useMemo } from "react";
import { useGame } from "../GameProvider";
import { useTranslation } from "react-i18next";

/**
 * useAvailableActions - Returns ALL available actions for current player/phase
 * Unlike the previous single-action approach, this returns an array of actions
 * allowing roles like Wolf Seer, Witch, and Arsonist to use multiple abilities
 */
const useAvailableActions = () => {
  const { t } = useTranslation();
  const {
    clientPlayer,
    playersList,
    aliveList,
    timeOfTheDay,
    dayCount,
    isUnderArrest,
  } = useGame();

  const role = clientPlayer?.role;
  const roleName = role?.name;
  const isWolf = role?.team === "Werewolves";
  const isAlive = clientPlayer?.isAlive;
  const isAftermath = timeOfTheDay?.includes("Aftermath");

  const actions = useMemo(() => {
    // No actions if dead, under arrest, or in aftermath phase
    if (!isAlive || isUnderArrest || isAftermath) return [];

    const availableActions = [];

    // === VOTE TIME ===
    if (timeOfTheDay === "votetime") {
      availableActions.push({
        type: "vote",
        emoji: "🗳️",
        label: t("game.vote") || "Vote",
        targets: aliveList.filter(p => p.id !== clientPlayer.id),
        priority: 1,
        autoOpen: true, // Vote phase auto-opens selection
      });
      return availableActions;
    }

    // === DAY TIME ===
    if (timeOfTheDay === "daytime") {
      switch (roleName) {
        case "Gunner":
          if (role.canPerform1?.nbrLeftToPerform > 0) {
            availableActions.push({
              type: "shoot",
              emoji: "🔫",
              label: t("game.tooltip.shoot") || "Shoot",
              targets: aliveList.filter(p => p.id !== clientPlayer.id),
              usesRemaining: role.canPerform1.nbrLeftToPerform,
              priority: 1,
            });
          }
          break;
        case "Seer":
          if (role.canPerform1?.nbrLeftToPerform > 0 && role.canPerform1?.actionTime === "daytime") {
            availableActions.push({
              type: "reveal",
              emoji: "👁️",
              label: t("game.tooltip.reveal") || "Reveal",
              targets: aliveList.filter(p => p.id !== clientPlayer.id && !p.isRevealed),
              usesRemaining: role.canPerform1.nbrLeftToPerform,
              priority: 1,
            });
          }
          break;
        case "Jailer":
          if (role.canPerform1?.nbrLeftToPerform > 0) {
            availableActions.push({
              type: "arrest",
              emoji: "👮",
              label: t("game.tooltip.arrest") || "Arrest",
              targets: aliveList.filter(p => p.id !== clientPlayer.id && !p.isUnderArrest),
              usesRemaining: role.canPerform1.nbrLeftToPerform,
              priority: 1,
            });
          }
          break;
        case "Captain":
          if (!clientPlayer.hasAssertedDuty) {
            availableActions.push({
              type: "assertDuty",
              emoji: "👑",
              label: t("game.tooltip.assertDuty") || "Assert Duty",
              targets: [],
              noSelection: true,
              priority: 1,
            });
          }
          break;
      }
      return availableActions;
    }

    // === NIGHT TIME ===
    if (timeOfTheDay === "nighttime") {
      // Wolf vote - all wolves can vote
      if (isWolf) {
        availableActions.push({
          type: "wolfVote",
          emoji: "🐺",
          label: t("game.tooltip.kill") || "Kill",
          targets: aliveList.filter(p => p.role?.team !== "Werewolves" && !p.isUnderArrest),
          priority: 1,
        });
      }

      // Role-specific night actions
      switch (roleName) {
        case "Wolf Seer":
          // Wolf Seer gets BOTH wolf vote (from above) AND uncover
          if (role.canPerform1?.nbrLeftToPerform > 0) {
            availableActions.push({
              type: "uncoverRole",
              emoji: "🔍",
              label: t("game.tooltip.uncover") || "Uncover",
              targets: aliveList.filter(p =>
                !p.isRevealedByWolfSeer && !p.isRevealed && p.id !== clientPlayer.id
              ),
              usesRemaining: role.canPerform1.nbrLeftToPerform,
              priority: 2,
            });
          }
          break;

        case "Seer":
          availableActions.push({
            type: "reveal",
            emoji: "👁️",
            label: t("game.tooltip.reveal") || "Reveal",
            targets: aliveList.filter(p => p.id !== clientPlayer.id && !p.isRevealed),
            priority: 1,
          });
          break;

        case "Doctor":
          availableActions.push({
            type: "heal",
            emoji: "💉",
            label: t("game.tooltip.heal") || "Heal",
            targets: aliveList.filter(p => p.id !== clientPlayer.id),
            priority: 1,
          });
          break;

        case "Witch":
          // Witch gets BOTH potions if available
          if (role.canPerform1?.nbrLeftToPerform > 0) {
            availableActions.push({
              type: "protectPotion",
              emoji: "🧪",
              label: t("game.tooltip.protect") || "Protect",
              targets: aliveList.filter(p => p.id !== clientPlayer.id),
              usesRemaining: role.canPerform1.nbrLeftToPerform,
              priority: 1,
            });
          }
          if (role.canPerform2?.nbrLeftToPerform > 0) {
            availableActions.push({
              type: "poisonPotion",
              emoji: "☠️",
              label: t("game.tooltip.poison") || "Poison",
              targets: aliveList.filter(p => p.id !== clientPlayer.id),
              usesRemaining: role.canPerform2.nbrLeftToPerform,
              priority: 2,
            });
          }
          break;

        case "Medium":
          if (role.canPerform1?.nbrLeftToPerform > 0) {
            const deadPlayers = playersList.filter(p => !p.isAlive);
            availableActions.push({
              type: "revive",
              emoji: "✨",
              label: t("game.tooltip.revive") || "Revive",
              targets: deadPlayers,
              usesRemaining: role.canPerform1.nbrLeftToPerform,
              priority: 1,
            });
          }
          break;

        case "Grave Robber":
          const lootableGraves = playersList.filter(p => !p.isAlive && !p.graveLooted);
          availableActions.push({
            type: "loot",
            emoji: "🪦",
            label: t("game.tooltip.loot") || "Loot",
            targets: lootableGraves,
            priority: 1,
          });
          break;

        case "Cupid":
          if (dayCount === 0 && role.canPerform1?.nbrLeftToPerform > 0) {
            availableActions.push({
              type: "link",
              emoji: "💘",
              label: t("game.tooltip.link") || "Link",
              targets: aliveList.filter(p => p.id !== clientPlayer.id),
              selectTwo: true,
              usesRemaining: role.canPerform1.nbrLeftToPerform,
              priority: 1,
            });
          }
          break;

        case "Jailer":
          if (clientPlayer?.hasHandcuffed && role.canPerform2?.nbrLeftToPerform > 0) {
            const prisoner = playersList.find(p => p.isUnderArrest);
            availableActions.push({
              type: "execute",
              emoji: "⚔️",
              label: t("game.tooltip.execute") || "Execute",
              targets: prisoner ? [prisoner] : [],
              usesRemaining: role.canPerform2.nbrLeftToPerform,
              priority: 1,
            });
          }
          break;

        case "Serial Killer":
          availableActions.push({
            type: "murder",
            emoji: "🔪",
            label: t("game.tooltip.kill") || "Kill",
            targets: aliveList.filter(p => p.id !== clientPlayer.id && !p.isUnderArrest),
            priority: 1,
          });
          break;

        case "Arsonist":
          // Arsonist gets BOTH pour AND burn if conditions met
          const markedCount = playersList.filter(p => p.isMarkedWithGasoline).length;

          // Can always pour on unmarked targets
          const pourTargets = aliveList.filter(p =>
            p.id !== clientPlayer.id && !p.isMarkedWithGasoline
          );
          if (pourTargets.length > 0) {
            availableActions.push({
              type: "pour",
              emoji: "⛽",
              label: t("game.tooltip.pour") || "Pour",
              targets: pourTargets,
              priority: 1,
            });
          }

          // Can burn if 2+ marked
          if (markedCount >= 2) {
            availableActions.push({
              type: "burn",
              emoji: "🔥",
              label: t("game.tooltip.burn") || "Burn",
              targets: [],
              noSelection: true,
              priority: 2,
            });
          }
          break;

        case "Ghost Lady":
          availableActions.push({
            type: "ghostVisit",
            emoji: "👻",
            label: t("game.tooltip.visit") || "Visit",
            targets: aliveList.filter(p => p.id !== clientPlayer.id && !p.isUnderArrest),
            priority: 1,
          });
          break;

        case "Alpha Werewolf":
          // Alpha gets same wolf vote but with 2x weight (handled in emit)
          break;

        case "Nightmare Werewolf":
          // Gets wolf vote (already added above for wolves)
          // Could add nightmare ability here if needed
          break;

        case "Baby Werewolf":
          // Gets wolf vote plus revenge choice
          if (role.canPerform1?.nbrLeftToPerform > 0) {
            availableActions.push({
              type: "chooseRevenge",
              emoji: "👶",
              label: t("game.tooltip.revenge") || "Revenge",
              targets: aliveList.filter(p => p.role?.team !== "Werewolves"),
              usesRemaining: role.canPerform1.nbrLeftToPerform,
              priority: 2,
            });
          }
          break;
      }

      return availableActions;
    }

    return [];
  }, [
    isAlive,
    isUnderArrest,
    isAftermath,
    timeOfTheDay,
    roleName,
    role,
    isWolf,
    aliveList,
    playersList,
    clientPlayer,
    dayCount,
    t,
  ]);

  // Sort by priority
  const sortedActions = useMemo(() => {
    return [...actions].sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }, [actions]);

  return sortedActions;
};

export default useAvailableActions;
