"use client";

import { useState } from "react";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";
import { useGame } from "./GameProvider";
import { divActionIcon } from "../lib/styles";

const getTeamStyles = (team) => {
  switch (team) {
    case "Werewolves":
      return {
        gradient: "from-red-950 via-red-900 to-black",
        border: "border-red-500",
        accent: "text-red-200",
        glow: "shadow-red-500/50",
        imageBorder: "border-red-500",
        badgeBg: "bg-red-600",
        abilityBg: "bg-red-900/40",
        abilityBorder: "border-red-700/50",
      };
    case "Village":
    case "Villagers":
      return {
        gradient: "from-emerald-900 via-green-800 to-emerald-950",
        border: "border-emerald-400",
        accent: "text-emerald-100",
        glow: "shadow-emerald-400/40",
        imageBorder: "border-emerald-400",
        badgeBg: "bg-emerald-600",
        abilityBg: "bg-emerald-900/40",
        abilityBorder: "border-emerald-700/50",
      };
    default:
      return {
        gradient: "from-violet-950 via-purple-900 to-indigo-950",
        border: "border-violet-400",
        accent: "text-violet-200",
        glow: "shadow-violet-500/50",
        imageBorder: "border-violet-400",
        badgeBg: "bg-violet-600",
        abilityBg: "bg-violet-900/40",
        abilityBorder: "border-violet-700/50",
      };
  }
};

const RoleGuideOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { clientPlayer } = useGame();
  const { t } = useTranslation();
  const role = clientPlayer?.role;

  if (!role) return null;

  const styles = getTeamStyles(role.team);
  const isFr = i18n.language === "fr";
  const roleName = isFr ? role.nameFR || role.name : role.name;
  const roleDesc = isFr
    ? role.descriptionFR || role.description
    : role.description;
  const teamName = isFr ? role.teamFR || role.team : role.team;

  const abilities = [];
  if (role.canPerform1 && role.canPerform1.label) {
    abilities.push({
      label: isFr
        ? role.canPerform1.labelFR || role.canPerform1.label
        : role.canPerform1.label,
      emoji: role.canPerform1.emoji || "",
      remaining: role.canPerform1.nbrLeftToPerform,
      actionTime: role.canPerform1.actionTime,
    });
  }
  if (role.canPerform2 && role.canPerform2.label) {
    abilities.push({
      label: isFr
        ? role.canPerform2.labelFR || role.canPerform2.label
        : role.canPerform2.label,
      emoji: role.canPerform2.emoji || "",
      remaining: role.canPerform2.nbrLeftToPerform,
      actionTime: role.canPerform2.actionTime,
    });
  }

  return (
    <>
      {/* Clickable role guide button — matches action bar style */}
      <Tooltip content={t("roleGuide.clickToView")} color="secondary" variant="flat">
        <div
          onClick={() => setIsOpen(true)}
          className={`bg-secondary hover:bg-blue-400 ${divActionIcon}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="#fff"
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M12 13c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
          </svg>
        </div>
      </Tooltip>

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`relative w-80 max-h-[85vh] rounded-2xl shadow-2xl ${styles.glow} overflow-hidden border-2 ${styles.border}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background */}
            {role.image2 ? (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                style={{ backgroundImage: `url(${role.image2})` }}
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${styles.gradient}`}
              />
            )}

            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-10 text-white/70 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors"
            >
              ✕
            </button>

            {/* Content */}
            <div className="relative z-10 p-6 flex flex-col gap-4">
              {/* Role icon + team badge */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-20 h-20 rounded-full border-3 ${styles.imageBorder} overflow-hidden bg-black/50 shadow-xl`}
                >
                  {role.image && (
                    <Image
                      src={role.image}
                      alt={roleName}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <div
                  className={`${styles.badgeBg} px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg`}
                >
                  {teamName}
                </div>
              </div>

              {/* Role name */}
              <div>
                <p
                  className={`${styles.accent} text-sm font-medium tracking-wide uppercase mb-1`}
                >
                  {t("game.youAre")}
                </p>
                <h2 className="text-white text-3xl font-bold drop-shadow-lg font-wolf">
                  {roleName}
                </h2>
              </div>

              {/* Description */}
              <p className="text-gray-200 text-sm leading-relaxed">
                {roleDesc}
              </p>

              {/* Abilities */}
              {abilities.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className={`${styles.accent} text-xs font-semibold uppercase tracking-wider`}>
                    {isFr ? "Capacites" : "Abilities"}
                  </h3>
                  {abilities.map((ability, idx) => (
                    <div
                      key={idx}
                      className={`${styles.abilityBg} border ${styles.abilityBorder} rounded-lg p-3 flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-2">
                        {ability.emoji && (
                          <Image
                            src={ability.emoji}
                            alt={ability.label}
                            width={22}
                            height={22}
                            className="flex-shrink-0 object-contain w-[22px] h-[22px]"
                          />
                        )}
                        <span className="text-white text-sm font-medium">
                          {ability.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {ability.actionTime && (
                          <span className="text-xs text-slate-400">
                            {ability.actionTime === "night"
                              ? isFr ? "Nuit" : "Night"
                              : ability.actionTime === "day"
                              ? isFr ? "Jour" : "Day"
                              : ability.actionTime}
                          </span>
                        )}
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            ability.remaining == null || ability.remaining > 0
                              ? "bg-green-600/80 text-green-100"
                              : "bg-red-600/80 text-red-100"
                          }`}
                        >
                          {ability.remaining == null ? "\u221E" : ability.remaining === 1 ? "unique" : ability.remaining}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoleGuideOverlay;
