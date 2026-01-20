"use client";

import { useGame } from "../../GameProvider";
import { useTranslation } from "react-i18next";

/**
 * PhaseHeader - Shows phase name, timer, and alive count
 */
const PhaseHeader = ({ title, emoji, subtitle }) => {
  const { timeCounter, aliveList, dayCount } = useGame();
  const { t } = useTranslation();

  // Convert milliseconds to seconds
  const timer = Math.ceil((timeCounter || 0) / 1000);

  const getBackgroundColor = () => {
    if (emoji === "☀️") return "bg-gradient-to-r from-amber-600 to-orange-500";
    if (emoji === "✉️") return "bg-gradient-to-r from-purple-600 to-indigo-600";
    if (emoji === "🌙" || emoji === "🐺") return "bg-gradient-to-r from-slate-800 to-slate-900";
    return "bg-slate-800";
  };

  return (
    <div className={`${getBackgroundColor()} px-4 py-3 shadow-lg`}>
      <div className="flex items-center justify-between">
        {/* Phase info */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <div>
            <h1 className="text-white font-bold text-lg">{title}</h1>
            {subtitle && (
              <p className="text-white/70 text-xs">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Timer and alive count */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-white/60 text-xs">{t("game.left") || "left"}</p>
            <p className="text-white font-bold text-lg">{aliveList?.length || 0}</p>
          </div>
          <div className={`px-3 py-1 rounded-full ${timer <= 10 ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}>
            <span className="text-white font-mono font-bold text-xl">
              {timer}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseHeader;
