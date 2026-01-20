"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGame } from "../../GameProvider";
import i18n from "../../../lib/i18n";
import Image from "next/image";

/**
 * IdleView - Default view when no action is selected
 *
 * Shows:
 * - Phase-appropriate background styling
 * - Player's role info
 * - Helpful hints based on phase
 */
const IdleView = () => {
  const { t } = useTranslation();
  const { clientPlayer, timeOfTheDay, dayCount } = useGame();

  const role = clientPlayer?.role;
  const displayRoleName = i18n.language === "fr" ? role?.nameFR : role?.name;

  // Phase-specific styling and messages
  const phaseConfig = useMemo(() => {
    switch (timeOfTheDay) {
      case "daytime":
        return {
          gradient: "from-amber-900/30 via-orange-900/20 to-slate-900",
          emoji: "☀️",
          title: t("game.daytime") || "Day",
          subtitle: t("game.daytimeHint") || "Discuss with other players",
          ambiance: "🏘️",
        };
      case "votetime":
        return {
          gradient: "from-red-900/40 via-rose-900/20 to-slate-900",
          emoji: "🗳️",
          title: t("game.votetime") || "Vote",
          subtitle: t("game.votetimeHint") || "Time to vote!",
          ambiance: "⚖️",
        };
      case "votetimeAftermath":
        return {
          gradient: "from-red-900/30 via-slate-900/50 to-slate-900",
          emoji: "🗳️",
          title: t("game.aftermath") || "Aftermath",
          subtitle: t("game.votetimeAftermathHint") || "Waiting for results...",
          ambiance: "⏳",
        };
      case "nighttime":
        return {
          gradient: "from-indigo-900/40 via-purple-900/20 to-slate-900",
          emoji: "🌙",
          title: t("game.nighttime") || "Night",
          subtitle: t("game.nighttimeHint") || "Use your abilities wisely",
          ambiance: "🦇",
        };
      case "nighttimeAftermath":
        return {
          gradient: "from-blue-900/30 via-slate-900/50 to-slate-900",
          emoji: "🌙",
          title: t("game.aftermath") || "Aftermath",
          subtitle: t("game.nighttimeAftermathHint") || "Waiting for dawn...",
          ambiance: "⏳",
        };
      default:
        return {
          gradient: "from-slate-800 to-slate-900",
          emoji: "🎮",
          title: "Game",
          subtitle: "",
          ambiance: "",
        };
    }
  }, [timeOfTheDay, t]);

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b ${phaseConfig.gradient}`}>
      {/* Phase indicator */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-5xl">{phaseConfig.emoji}</span>
        <div>
          <h2 className="text-white text-2xl font-bold">
            {phaseConfig.title} {dayCount}
          </h2>
          <p className="text-slate-400 text-sm">{phaseConfig.subtitle}</p>
        </div>
      </div>

      {/* Role card */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 max-w-xs w-full">
        <div className="flex flex-col items-center">
          {/* Role image */}
          {role?.image && (
            <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-700 mb-4 ring-4 ring-slate-600">
              <Image
                src={role.image}
                alt={displayRoleName || "Role"}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Role name */}
          <h3 className="text-white text-xl font-bold mb-1">
            {displayRoleName}
          </h3>

          {/* Team indicator */}
          <p className={`text-sm font-medium ${
            role?.team === "Werewolves" ? "text-red-400" :
            role?.team === "Village" ? "text-green-400" :
            "text-purple-400"
          }`}>
            {role?.team}
          </p>

          {/* Player status */}
          <div className="flex gap-2 mt-4">
            {!clientPlayer?.isAlive && (
              <span className="px-2 py-1 bg-red-900/50 text-red-300 rounded text-xs">
                💀 {t("game.dead") || "Dead"}
              </span>
            )}
            {clientPlayer?.isUnderArrest && (
              <span className="px-2 py-1 bg-orange-900/50 text-orange-300 rounded text-xs">
                👮 {t("game.arrested") || "Arrested"}
              </span>
            )}
            {clientPlayer?.willHaveNightmares && (
              <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-xs">
                😱 {t("game.nightmare") || "Nightmare"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ambiance decoration */}
      <div className="mt-8 text-4xl opacity-20">
        {phaseConfig.ambiance}
      </div>
    </div>
  );
};

export default IdleView;
