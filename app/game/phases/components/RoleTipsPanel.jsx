"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGame } from "../../GameProvider";

/**
 * RoleTipsPanel - Compact role-based tips and instructions
 *
 * Shows contextual guidance based on player's role and current phase.
 * Designed to work alongside the chat panel in a split layout.
 */
const RoleTipsPanel = () => {
  const { t } = useTranslation();
  const {
    clientPlayer,
    timeOfTheDay,
    dayCount,
    isUnderArrest,
    playersList,
  } = useGame();

  const role = clientPlayer?.role;
  const roleName = role?.name;
  const isWolf = role?.team === "Werewolves";
  const isAlive = clientPlayer?.isAlive;

  // Get role-specific instructions
  const roleInstructions = useMemo(() => {
    if (!role) return null;

    const isNight = timeOfTheDay === "nighttime";
    const isDay = timeOfTheDay === "daytime";
    const isVote = timeOfTheDay === "votetime";
    const isAftermath = timeOfTheDay?.includes("Aftermath");

    // Dead players
    if (!isAlive) {
      return {
        title: t("game.idle.dead.title") || "You are dead",
        tips: [
          t("game.idle.dead.tip1") || "Your role has been revealed to all players",
          roleName === "Medium"
            ? (t("game.idle.dead.tipMedium") || "As Medium, you can still communicate with the living")
            : (t("game.idle.dead.tip2") || "You can no longer vote or use abilities"),
        ],
        color: "slate",
      };
    }

    // Under arrest
    if (isUnderArrest && isNight) {
      return {
        title: t("game.idle.jail.title") || "You are in jail",
        tips: [
          t("game.idle.jail.tip1") || "You cannot use your abilities tonight",
          t("game.idle.jail.tip2") || "Convince the Jailer of your innocence",
        ],
        color: "orange",
      };
    }

    // Aftermath phases
    if (isAftermath) {
      if (timeOfTheDay === "nighttimeAftermath") {
        return {
          title: t("game.idle.dawnApproaching") || "Dawn approaches",
          tips: [t("game.idle.nightResults") || "The night's events will soon be revealed."],
          color: "indigo",
        };
      }
      if (timeOfTheDay === "votetimeAftermath") {
        return {
          title: t("game.idle.voteResults") || "Counting votes",
          tips: [t("game.idle.verdictSoon") || "The village's verdict will be announced."],
          color: "red",
        };
      }
    }

    // Role-specific
    return getRoleConfig(roleName, { t, isNight, isDay, isVote, dayCount, role, clientPlayer, playersList, isWolf });
  }, [role, roleName, timeOfTheDay, dayCount, isAlive, isUnderArrest, clientPlayer, playersList, isWolf, t]);

  if (!roleInstructions) return null;

  const colorClasses = {
    slate: { bg: "bg-slate-800/50", border: "border-slate-600/50", accent: "text-slate-400" },
    indigo: { bg: "bg-indigo-900/30", border: "border-indigo-500/30", accent: "text-indigo-400" },
    red: { bg: "bg-red-900/20", border: "border-red-500/30", accent: "text-red-400" },
    green: { bg: "bg-green-900/20", border: "border-green-500/30", accent: "text-green-400" },
    purple: { bg: "bg-purple-900/20", border: "border-purple-500/30", accent: "text-purple-400" },
    orange: { bg: "bg-orange-900/20", border: "border-orange-500/30", accent: "text-orange-400" },
    amber: { bg: "bg-amber-900/20", border: "border-amber-500/30", accent: "text-amber-400" },
    cyan: { bg: "bg-cyan-900/20", border: "border-cyan-500/30", accent: "text-cyan-400" },
    pink: { bg: "bg-pink-900/20", border: "border-pink-500/30", accent: "text-pink-400" },
  };

  const colors = colorClasses[roleInstructions.color] || colorClasses.slate;

  return (
    <div className={`h-full flex flex-col p-3 md:p-4 ${colors.bg} border-b md:border-b-0 md:border-r ${colors.border}`}>
      {/* Title */}
      <h3 className={`text-xs md:text-sm font-semibold ${colors.accent} mb-2 md:mb-3`}>
        {roleInstructions.title}
      </h3>

      {/* Tips - always vertical, scrollable */}
      <div className="flex-1 flex flex-col gap-1.5 md:gap-2 overflow-y-auto">
        {roleInstructions.tips?.map((tip, index) => (
          <div key={index} className="flex items-start gap-1.5 md:gap-2">
            <span className={`${colors.accent} text-[10px] md:text-xs mt-0.5`}>•</span>
            <p className="text-slate-300 text-[11px] md:text-xs leading-relaxed">
              {tip}
            </p>
          </div>
        ))}
      </div>

      {/* Action status */}
      {roleInstructions.actionStatus && (
        <div className={`mt-2 md:mt-3 pt-2 md:pt-3 border-t ${colors.border}`}>
          <div className={`text-[10px] md:text-xs font-medium ${
            roleInstructions.actionStatus.available ? "text-green-400" : "text-slate-500"
          }`}>
            {roleInstructions.actionStatus.available ? "✓" : "✗"} {roleInstructions.actionStatus.text}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Get role-specific configuration
 */
function getRoleConfig(roleName, context) {
  const { t, isNight, isDay, isVote, dayCount, role, clientPlayer, playersList } = context;

  // Default villager config
  const defaultConfig = {
    title: isNight
      ? (t("game.idle.villager.nightTitle") || "The village sleeps")
      : (t("game.idle.villager.dayTitle") || "Discuss with the village"),
    tips: isNight
      ? [
          t("game.idle.villager.tip1") || "Pay attention to who dies tonight",
          t("game.idle.villager.tip2") || "Think about who might be lying",
        ]
      : [
          t("game.idle.villager.dayTip1") || "Observe player behavior carefully",
          t("game.idle.villager.dayTip2") || "Share information but be careful with accusations",
        ],
    color: "green",
  };

  const configs = {
    "Villager": defaultConfig,

    "Seer": {
      title: isNight ? (t("game.idle.seer.nightTitle") || "Use your vision") : (t("game.idle.seer.dayTitle") || "Guide the village"),
      tips: isNight
        ? [t("game.idle.seer.tip1") || "Reveal suspicious players to find wolves", t("game.idle.seer.tip2") || "Be careful not to reveal yourself too early"]
        : [t("game.idle.seer.dayTip1") || "Share revelations strategically", t("game.idle.seer.dayTip2") || "Wolves will target you if discovered"],
      color: "cyan",
      actionStatus: role?.canPerform1?.actionTime === "daytime" && isDay
        ? { available: role.canPerform1.nbrLeftToPerform > 0, text: role.canPerform1.nbrLeftToPerform > 0 ? t("game.idle.canReveal") || "Can reveal a player" : t("game.idle.alreadyRevealed") || "Already revealed today" }
        : null,
    },

    "Doctor": {
      title: isNight ? (t("game.idle.doctor.nightTitle") || "Choose who to protect") : (t("game.idle.doctor.dayTitle") || "Keep your identity hidden"),
      tips: isNight
        ? [t("game.idle.doctor.tip1") || "Try to predict who wolves will target", t("game.idle.doctor.tip2") || "You cannot heal yourself"]
        : [t("game.idle.doctor.dayTip1") || "Don't reveal yourself to the village"],
      color: "green",
    },

    "Gunner": {
      title: isDay ? (t("game.idle.gunner.dayTitle") || "Use your bullets wisely") : (t("game.idle.gunner.nightTitle") || "Rest for the night"),
      tips: isDay
        ? [t("game.idle.gunner.tip1") || "Only shoot when you're sure of a wolf", t("game.idle.gunner.tip2") || "Missing reveals your role to everyone"]
        : [t("game.idle.gunner.nightTip1") || "Think about who to target tomorrow"],
      color: "amber",
      actionStatus: isDay ? { available: role?.canPerform1?.nbrLeftToPerform > 0, text: `${role?.canPerform1?.nbrLeftToPerform || 0} ${t("game.idle.bulletsLeft") || "bullets left"}` } : null,
    },

    "Jailer": {
      title: isNight
        ? clientPlayer?.hasHandcuffed ? (t("game.idle.jailer.nightTitleWithPrisoner") || "Interrogate your prisoner") : (t("game.idle.jailer.nightTitle") || "The jail is empty")
        : (t("game.idle.jailer.dayTitle") || "Choose who to arrest"),
      tips: isNight && clientPlayer?.hasHandcuffed
        ? [t("game.idle.jailer.tip1") || "Question your prisoner carefully", t("game.idle.jailer.tip2") || "You can execute them if you believe they're evil"]
        : isDay ? [t("game.idle.jailer.dayTip1") || "Arrested players can't use abilities at night"] : [],
      color: "orange",
    },

    "Witch": {
      title: isNight ? (t("game.idle.witch.nightTitle") || "Choose your potions") : (t("game.idle.witch.dayTitle") || "Keep your potions secret"),
      tips: isNight
        ? [
            role?.canPerform1?.nbrLeftToPerform > 0 ? (t("game.idle.witch.tip1") || "Protection potion available") : (t("game.idle.witch.tip1Used") || "Protection potion used"),
            role?.canPerform2?.nbrLeftToPerform > 0 ? (t("game.idle.witch.tip2") || "Poison potion available") : (t("game.idle.witch.tip2Used") || "Poison potion used"),
          ]
        : [t("game.idle.witch.dayTip1") || "Don't reveal which potions you have left"],
      color: "purple",
    },

    "Medium": {
      title: isNight ? (t("game.idle.medium.nightTitle") || "Speak with the dead") : (t("game.idle.medium.dayTitle") || "Share wisdom from beyond"),
      tips: isNight
        ? [t("game.idle.medium.tip1") || "Dead players know their killer's identity", role?.canPerform1?.nbrLeftToPerform > 0 ? (t("game.idle.medium.tip2") || "You can revive one dead player") : (t("game.idle.medium.tip2Used") || "Revive ability used")]
        : [t("game.idle.medium.dayTip1") || "Be careful sharing information from the dead"],
      color: "pink",
    },

    "Cupid": {
      title: dayCount === 0 && isNight ? (t("game.idle.cupid.nightTitle") || "Link two lovers") : (t("game.idle.cupid.dayTitle") || "Protect your lovers"),
      tips: dayCount === 0 && isNight
        ? [t("game.idle.cupid.tip1") || "Lovers share their fate", t("game.idle.cupid.tip2") || "If a wolf and villager are linked, they become a third faction"]
        : [t("game.idle.cupid.dayTip1") || "Watch over your lovers carefully"],
      color: "pink",
    },

    "Grave Robber": {
      title: isNight ? (t("game.idle.graveRobber.nightTitle") || "Visit the graveyard") : (t("game.idle.graveRobber.dayTitle") || "Act like a villager"),
      tips: isNight
        ? [t("game.idle.graveRobber.tip1") || "You become whatever role you steal", t("game.idle.graveRobber.tip2") || "Choose valuable roles like Seer or Doctor"]
        : [t("game.idle.graveRobber.dayTip1") || "Don't reveal your new identity too soon"],
      color: "slate",
    },

    "Captain": {
      title: isDay
        ? clientPlayer?.hasAssertedDuty ? (t("game.idle.captain.dayTitleAsserted") || "Lead the village") : (t("game.idle.captain.dayTitle") || "Assert your duty")
        : (t("game.idle.captain.nightTitle") || "Rest, Captain"),
      tips: isDay && !clientPlayer?.hasAssertedDuty
        ? [t("game.idle.captain.tip1") || "Assert duty to make your vote count 3x", t("game.idle.captain.tip2") || "This reveals you to everyone"]
        : [],
      color: "amber",
    },

    "Cursed Villager": {
      title: t("game.idle.cursed.title") || "Living under a curse",
      tips: [t("game.idle.cursed.tip1") || "Seers will see you as a villager", t("game.idle.cursed.tip2") || "Survive wolf attacks to join their pack"],
      color: "purple",
    },

    "Werewolf": {
      title: isNight ? (t("game.idle.wolf.nightTitle") || "Hunt with your pack") : (t("game.idle.wolf.dayTitle") || "Blend in with villagers"),
      tips: isNight
        ? [t("game.idle.wolf.tip1") || "Coordinate with other wolves", t("game.idle.wolf.tip2") || "Avoid targeting protected players"]
        : [t("game.idle.wolf.dayTip1") || "Accuse villagers subtly", t("game.idle.wolf.dayTip2") || "Don't defend other wolves too obviously"],
      color: "red",
    },

    "Wolf Seer": {
      title: isNight ? (t("game.idle.wolfSeer.nightTitle") || "Hunt and uncover") : (t("game.idle.wolfSeer.dayTitle") || "Use your knowledge"),
      tips: isNight
        ? [t("game.idle.wolfSeer.tip1") || "Reveal dangerous roles like Seer or Gunner", t("game.idle.wolfSeer.tip2") || "Help your pack target the right players"]
        : [t("game.idle.wolfSeer.dayTip1") || "Use your knowledge to frame villagers"],
      color: "red",
      actionStatus: isNight && role?.canPerform1?.nbrLeftToPerform > 0 ? { available: true, text: t("game.idle.canUncover") || "Can uncover a role" } : null,
    },

    "Alpha Werewolf": {
      title: isNight ? (t("game.idle.alpha.nightTitle") || "Lead the hunt") : (t("game.idle.alpha.dayTitle") || "Command from the shadows"),
      tips: isNight
        ? [t("game.idle.alpha.tip1") || "Your vote weighs more in the pack", t("game.idle.alpha.tip2") || "Guide younger wolves"]
        : [t("game.idle.alpha.dayTip1") || "Coordinate defense strategies"],
      color: "red",
    },

    "Nightmare Werewolf": {
      title: isNight ? (t("game.idle.nightmare.nightTitle") || "Spread terror") : (t("game.idle.nightmare.dayTitle") || "Hide in plain sight"),
      tips: isNight
        ? [t("game.idle.nightmare.tip1") || "Survivors of your attacks are disabled", t("game.idle.nightmare.tip2") || "Use this to neutralize threats"]
        : [],
      color: "red",
    },

    "Baby Werewolf": {
      title: isNight ? (t("game.idle.babyWolf.nightTitle") || "Hunt with protection") : (t("game.idle.babyWolf.dayTitle") || "Stay safe, little wolf"),
      tips: isNight
        ? [t("game.idle.babyWolf.tip1") || "Choose who dies if you're killed", t("game.idle.babyWolf.tip2") || "This discourages attacks on you"]
        : [],
      color: "red",
    },

    "Fool": {
      title: isVote ? (t("game.idle.fool.voteTitle") || "Get yourself lynched!") : (t("game.idle.fool.title") || "Play the long con"),
      tips: [t("game.idle.fool.tip1") || "Act suspicious enough to be lynched", t("game.idle.fool.tip2") || "But not so obvious they suspect you're the Fool"],
      color: "purple",
    },

    "Serial Killer": {
      title: isNight ? (t("game.idle.sk.nightTitle") || "Choose your victim") : (t("game.idle.sk.dayTitle") || "Maintain your cover"),
      tips: isNight
        ? [t("game.idle.sk.tip1") || "You're immune to wolf attacks", t("game.idle.sk.tip2") || "Kill strategically to avoid suspicion"]
        : [t("game.idle.sk.dayTip1") || "Frame wolves for your kills"],
      color: "purple",
    },

    "Arsonist": {
      title: isNight ? (t("game.idle.arsonist.nightTitle") || "Spread the flames") : (t("game.idle.arsonist.dayTitle") || "Plan your inferno"),
      tips: (() => {
        const marked = playersList?.filter(p => p.isMarkedWithGasoline)?.length || 0;
        return isNight
          ? [`${marked} ${t("game.idle.arsonist.tip1") || "players marked"}`, marked >= 2 ? (t("game.idle.arsonist.tip2") || "You can ignite!") : (t("game.idle.arsonist.tip3") || "Mark at least 2 to ignite")]
          : [t("game.idle.arsonist.dayTip1") || "No one knows who you've marked"];
      })(),
      color: "orange",
    },

    "Ghost Lady": {
      title: isNight ? (t("game.idle.ghost.nightTitle") || "Choose who to visit") : (t("game.idle.ghost.dayTitle") || "Watch from the shadows"),
      tips: isNight
        ? [t("game.idle.ghost.tip1") || "Visit someone to stay safe tonight", t("game.idle.ghost.tip2") || "You must visit a player each night to survive"]
        : [],
      color: "cyan",
    },
  };

  return configs[roleName] || defaultConfig;
}

export default RoleTipsPanel;
