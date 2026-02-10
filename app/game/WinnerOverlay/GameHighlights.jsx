"use client";

import Image from "next/image";
import AvatarUI from "../../components/AvatarUI";
import { useTranslation } from "react-i18next";
import i18n from "../../lib/i18n";

const GameHighlights = ({ highlightsData }) => {
  const { t } = useTranslation();
  const isFr = i18n.language === "fr";

  if (!highlightsData) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400 text-sm">
        {t("highlights.noHighlights")}
      </div>
    );
  }

  const { mvp, highlights, playerScores } = highlightsData;

  return (
    <div className="flex flex-col gap-4">
      {/* MVP Banner */}
      {mvp && (
        <div className="relative bg-gradient-to-r from-yellow-900/40 via-yellow-700/30 to-yellow-900/40 border border-yellow-600/50 rounded-xl p-4 overflow-hidden">
          <div className="absolute top-1 right-2 text-3xl opacity-20 select-none">
            ⭐
          </div>
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3">
            {t("highlights.mvpTitle")}
          </p>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              {mvp.avatar ? (
                <AvatarUI heightAndWidth={48} avatar={mvp.avatar} />
              ) : (
                <Image
                  src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717510105/cpu_ir0roq.png"
                  alt="mvp-avatar"
                  height={48}
                  width={48}
                  className="rounded-full"
                />
              )}
              {mvp.role?.image && (
                <Image
                  src={mvp.role.image}
                  alt="mvp-role"
                  height={24}
                  width={24}
                  className="absolute -top-1 -right-1"
                />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-white font-bold text-sm truncate">
                {mvp.playerName}
              </p>
              <p className="text-yellow-300/80 text-xs">
                {isFr ? mvp.role?.nameFR : mvp.role?.name}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1 bg-yellow-600/30 rounded-lg px-3 py-1.5 flex-shrink-0">
              <span className="text-yellow-400 text-lg">⭐</span>
              <span className="text-yellow-300 font-bold text-sm">
                {mvp.points} {t("highlights.points")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Highlights Cards */}
      {highlights.length > 0 && (
        <div>
          <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
            {t("highlights.highlightsTitle")}
          </p>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            {highlights.map((h, idx) => (
              <div
                key={`${h.key}-${idx}`}
                className="flex items-center gap-2 bg-slate-700/40 border border-slate-600/30 rounded-lg px-3 py-2"
              >
                <span className="text-xl flex-shrink-0">{h.emoji}</span>
                <p className="text-slate-200 text-xs">
                  {t(`highlights.${h.key}`, {
                    name: h.playerName,
                    count: h.count || 0,
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {highlights.length === 0 && (
        <div className="flex items-center justify-center p-4 text-slate-500 text-xs">
          {t("highlights.noHighlights")}
        </div>
      )}

      {/* Scoreboard */}
      {playerScores && playerScores.length > 0 && (
        <div>
          <p className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
            {t("highlights.scoreboardTitle")}
          </p>
          <div className="flex flex-col gap-1">
            {playerScores.map((ps, idx) => (
              <div
                key={ps.playerId}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${
                  idx === 0
                    ? "bg-yellow-900/30 border border-yellow-700/30"
                    : "bg-slate-700/20"
                }`}
              >
                <span className="text-slate-400 text-xs font-bold w-5 text-center">
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                </span>
                <div className="flex-shrink-0">
                  {ps.avatar ? (
                    <AvatarUI heightAndWidth={24} avatar={ps.avatar} />
                  ) : (
                    <Image
                      src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717510105/cpu_ir0roq.png"
                      alt="player-avatar"
                      height={24}
                      width={24}
                    />
                  )}
                </div>
                <span className="text-white text-xs truncate flex-1">
                  {ps.playerName}
                </span>
                <span className="text-xs text-slate-400 italic">
                  {isFr ? ps.role?.nameFR : ps.role?.name}
                </span>
                <span className="text-yellow-400 text-xs font-bold ml-1">
                  {ps.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHighlights;
