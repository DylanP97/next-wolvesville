"use client";

import { useTranslation } from "react-i18next";
import i18n from "../../lib/i18n";

const phaseIcons = {
  daytime: "☀️",
  votetime: "✉️",
  nighttime: "🌒",
  votetimeAftermath: "⚖️",
  nighttimeAftermath: "🌙",
};

const actionIcons = {
  reveal: "👁️",
  heal: "💊",
  shoot: "🔫",
  execute: "👮",
  death: "💀",
  phaseChange: "🔄",
};

const causeLabels = {
  en: {
    lynch: "Lynched by village vote",
    wolves: "Killed by wolves",
    gunshot: "Shot by gunner",
    poison: "Poisoned by witch",
    execution: "Executed by jailer",
    fire: "Burned by arsonist",
    murder: "Murdered by serial killer",
    lover_suicide: "Died of broken heart",
    ghost: "Killed by ghost",
    unknown: "Died",
  },
  fr: {
    lynch: "Lynche par le village",
    wolves: "Devore par les loups",
    gunshot: "Abattu par le tireur",
    poison: "Empoisonne par la sorciere",
    execution: "Execute par le geolier",
    fire: "Brule par le pyromane",
    murder: "Assassine par le tueur en serie",
    lover_suicide: "Mort de chagrin",
    ghost: "Tue par le fantome",
    unknown: "Mort",
  },
};

const GameTimeline = ({ timeline }) => {
  const { t } = useTranslation();
  const isFr = i18n.language === "fr";

  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center text-slate-400 py-8 text-sm italic">
        {isFr ? "Aucun evenement enregistre" : "No events recorded"}
      </div>
    );
  }

  const getEventDisplay = (event) => {
    if (event.type === "phaseChange") {
      const phaseNames = {
        en: { daytime: "Day", votetime: "Vote Time", nighttime: "Night" },
        fr: { daytime: "Jour", votetime: "Vote", nighttime: "Nuit" },
      };
      const lang = isFr ? "fr" : "en";
      return {
        icon: phaseIcons[event.detail] || "🔄",
        text: `${phaseNames[lang][event.detail] || event.detail} ${event.cycle > 0 ? `#${event.cycle}` : ""}`,
        style: "bg-slate-700/50 border-slate-600",
      };
    }

    if (event.type === "death") {
      const lang = isFr ? "fr" : "en";
      const causeText = causeLabels[lang][event.cause] || causeLabels[lang].unknown;
      return {
        icon: "💀",
        text: `${event.playerName} - ${causeText}`,
        style: "bg-red-900/40 border-red-700/50",
      };
    }

    if (event.type === "action") {
      const actionNames = {
        en: { reveal: "Seer revealed", heal: "Doctor healed", shoot: "Gunner shot", execute: "Jailer executed" },
        fr: { reveal: "Voyante a revele", heal: "Docteur a soigne", shoot: "Tireur a tire sur", execute: "Geolier a execute" },
      };
      const lang = isFr ? "fr" : "en";
      const actionText = actionNames[lang][event.actionType] || event.actionType;
      const target = event.targetName ? ` ${event.targetName}` : "";
      return {
        icon: actionIcons[event.actionType] || "⚡",
        text: `${actionText}${target}`,
        style: "bg-blue-900/40 border-blue-700/50",
      };
    }

    return { icon: "❓", text: JSON.stringify(event), style: "bg-slate-700/50 border-slate-600" };
  };

  // Group events by cycle
  const grouped = {};
  timeline.forEach((event) => {
    const cycle = event.cycle || 0;
    if (!grouped[cycle]) grouped[cycle] = [];
    grouped[cycle].push(event);
  });

  return (
    <div className="flex flex-col gap-3">
      {Object.entries(grouped).map(([cycle, events]) => (
        <div key={cycle} className="flex flex-col gap-1.5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {isFr ? "Cycle" : "Cycle"} {cycle}
          </div>
          {events.map((event, idx) => {
            const display = getEventDisplay(event);
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${display.style} text-sm`}
              >
                <span className="text-base flex-shrink-0">{display.icon}</span>
                <span className="text-slate-200">{display.text}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameTimeline;
