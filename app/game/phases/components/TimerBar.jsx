"use client";

import { useState } from "react";
import { useGame } from "../../GameProvider";
import { useAuth } from "../../../providers/AuthProvider";
import { useSound } from "../../../providers/SoundProvider";
import { useTranslation } from "react-i18next";
import Image from "next/image";

/**
 * TimerBar - Shows phase, timer, role info, and menu button
 */
const TimerBar = ({ phase, dayCount, roleName, roleImage }) => {
  const { t } = useTranslation();
  const { timeCounter, aliveList, playersList, gameId } = useGame();
  const { socket } = useAuth();
  const { isMuted, setIsMuted } = useSound();

  const [showMenu, setShowMenu] = useState(false);

  // Convert milliseconds to seconds
  const timer = Math.ceil((timeCounter || 0) / 1000);
  const aliveCount = aliveList?.length || 0;
  const totalCount = playersList?.length || 0;

  const handleLeaveGame = () => {
    if (confirm(t("game.confirmLeave") || "Are you sure you want to leave the game?")) {
      socket?.emit("leaveGame", gameId);
      window.location.href = "/";
    }
  };

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={`bg-gradient-to-r ${phase.color} px-4 py-3 flex items-center justify-between relative`}>
      {/* Left: Phase info */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{phase.emoji}</span>
        <div>
          <p className="text-white font-bold text-sm">{phase.name} {dayCount}</p>
          <p className="text-white/70 text-xs">{aliveCount}/{totalCount} alive</p>
        </div>
      </div>

      {/* Center: Timer */}
      <div className="flex items-center gap-2 bg-black/30 rounded-full px-4 py-1">
        <span className="text-white font-mono text-xl font-bold">{timer || "0"}</span>
        <span className="text-white/60 text-xs">sec</span>
      </div>

      {/* Right: Role info + Menu */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-white text-sm font-medium">{roleName}</p>
        </div>
        {roleImage && (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800">
            <Image
              src={roleImage}
              alt={roleName || "Role"}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        )}

        {/* Menu Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          aria-label="Menu"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop to close menu */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu panel */}
          <div className="absolute right-4 top-full mt-2 z-50 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden min-w-48">
            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700 transition-colors text-left"
            >
              <span className="text-xl">{isMuted ? "🔇" : "🔊"}</span>
              <span className="text-white text-sm">
                {isMuted ? (t("game.unmute") || "Unmute") : (t("game.mute") || "Mute")}
              </span>
            </button>

            {/* Divider */}
            <div className="border-t border-slate-700" />

            {/* Leave game */}
            <button
              onClick={handleLeaveGame}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-900/50 transition-colors text-left"
            >
              <span className="text-xl">🚪</span>
              <span className="text-red-400 text-sm">{t("game.leave") || "Leave Game"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TimerBar;
