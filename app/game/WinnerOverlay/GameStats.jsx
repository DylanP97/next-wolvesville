"use client";

import i18n from "../../lib/i18n";

const GameStats = ({ roleActions, startTime, hasEnded, dayCount }) => {
  const isFr = i18n.language === "fr";

  const durationMs = hasEnded && startTime ? hasEnded - startTime : 0;
  const durationMin = Math.floor(durationMs / 60000);
  const durationSec = Math.floor((durationMs % 60000) / 1000);

  const stats = [
    {
      label: isFr ? "Duree" : "Duration",
      value: durationMs > 0 ? `${durationMin}m ${durationSec}s` : "—",
      icon: "⏱️",
    },
    {
      label: isFr ? "Cycles" : "Cycles",
      value: dayCount || 0,
      icon: "🔄",
    },
    {
      label: isFr ? "Victimes des loups" : "Wolf kills",
      value: roleActions?.wolfKills || 0,
      icon: "🐺",
    },
    {
      label: isFr ? "Soins du docteur" : "Doctor saves",
      value: roleActions?.doctorSaves || 0,
      icon: "💊",
    },
    {
      label: isFr ? "Soins de la sorciere" : "Witch saves",
      value: roleActions?.witchSaves || 0,
      icon: "🧹",
    },
    {
      label: isFr ? "Empoisonnements" : "Witch kills",
      value: roleActions?.witchKills || 0,
      icon: "☠️",
    },
    {
      label: isFr ? "Revelations" : "Seer reveals",
      value: roleActions?.seerReveals || 0,
      icon: "👁️",
    },
    {
      label: isFr ? "Tirs du tireur" : "Gunner kills",
      value: roleActions?.gunnerKills || 0,
      icon: "🔫",
    },
    {
      label: isFr ? "Executions" : "Jailer executions",
      value: roleActions?.jailerExecutions || 0,
      icon: "👮",
    },
    {
      label: isFr ? "Victimes du tueur" : "SK kills",
      value: roleActions?.skKills || 0,
      icon: "🔪",
    },
    {
      label: isFr ? "Incendies" : "Arsonist burns",
      value: roleActions?.arsonistBurns || 0,
      icon: "🔥",
    },
    {
      label: isFr ? "Resurrections" : "Medium revives",
      value: roleActions?.mediumRevives || 0,
      icon: "✨",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center gap-1 bg-slate-700/40 border border-slate-600/50 rounded-lg p-3"
        >
          <span className="text-2xl">{stat.icon}</span>
          <span className="text-white text-lg font-bold">{stat.value}</span>
          <span className="text-slate-400 text-xs text-center">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default GameStats;
