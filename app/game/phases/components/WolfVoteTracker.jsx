"use client";

import { useMemo } from "react";
import { useGame } from "../../GameProvider";
import { useTranslation } from "react-i18next";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import i18n from "../../../lib/i18n";

/**
 * WolfVoteTracker - Shows wolf pack voting progress
 *
 * Displays:
 * - Each wolf and who they voted for
 * - Current target with most votes
 * - Only visible to wolves during nighttime
 */
const WolfVoteTracker = () => {
  const { t } = useTranslation();
  const { playersList, clientPlayer, timeOfTheDay } = useGame();

  const isWolf = clientPlayer?.role?.team === "Werewolves";
  const isNight = timeOfTheDay === "nighttime" || timeOfTheDay === "nighttimeAftermath";

  // Get all wolves and their votes
  const wolvesData = useMemo(() => {
    if (!playersList || !isWolf) return { wolves: [], voteCount: {}, leadingTarget: null };

    const wolves = playersList.filter(p => p.role?.team === "Werewolves" && p.isAlive);
    const voteCount = {};

    wolves.forEach(wolf => {
      if (wolf.hasWolfVotedFor) {
        const targetName = wolf.hasWolfVotedFor;
        voteCount[targetName] = (voteCount[targetName] || 0) + (wolf.role?.name === "Alpha Werewolf" ? 2 : 1);
      }
    });

    // Find leading target
    let leadingTarget = null;
    let maxVotes = 0;
    Object.entries(voteCount).forEach(([name, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        leadingTarget = { name, votes: count };
      }
    });

    return { wolves, voteCount, leadingTarget };
  }, [playersList, isWolf]);

  // Get revealed players for wolves (from nightmare wolf)
  const revealedToWolves = useMemo(() => {
    if (!playersList || !isWolf) return [];

    // Players revealed by nightmare wolf or wolf seer
    return playersList.filter(p =>
      p.isAlive &&
      !p.role?.team === "Werewolves" &&
      (p.revealedToWolves || p.roleRevealedByWolfSeer)
    );
  }, [playersList, isWolf]);

  if (!isWolf || !isNight) {
    return null;
  }

  const { wolves, leadingTarget } = wolvesData;

  return (
    <div className="flex flex-col h-full bg-slate-900/80">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-2.5 bg-red-900/50 border-b border-red-700/50 flex items-center gap-2">
        <span className="text-lg">🐺</span>
        <span className="text-white text-sm font-medium">
          {t("game.wolfPack") || "Wolf Pack"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Current Target */}
        {leadingTarget && (
          <div className="bg-red-800/30 rounded-lg p-3 border border-red-500/30">
            <p className="text-red-300 text-xs uppercase tracking-wide mb-1">
              {t("game.wolfTarget") || "Target"}
            </p>
            <p className="text-white font-bold text-lg flex items-center gap-2">
              <span>🎯</span>
              {leadingTarget.name}
              <span className="text-red-400 text-sm font-normal">
                ({leadingTarget.votes} {leadingTarget.votes === 1 ? "vote" : "votes"})
              </span>
            </p>
          </div>
        )}

        {/* Wolf Votes */}
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
            {t("game.wolfVotes") || "Pack Votes"}
          </p>
          <div className="space-y-2">
            {wolves.map(wolf => (
              <WolfVoteCard key={wolf.id} wolf={wolf} isYou={wolf.id === clientPlayer?.id} />
            ))}
          </div>
        </div>

        {/* Revealed Players (from Nightmare Wolf / Wolf Seer) */}
        {revealedToWolves.length > 0 && (
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-1">
              <span>👁️</span>
              {t("game.revealedToWolves") || "Revealed Roles"}
            </p>
            <div className="space-y-1">
              {revealedToWolves.map(player => (
                <div key={player.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2">
                  <span className="text-white text-sm">{player.name}</span>
                  <span className="text-yellow-400 text-xs">
                    {i18n.language === "fr" ? player.role?.nameFR : player.role?.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * WolfVoteCard - Single wolf's vote status
 */
const WolfVoteCard = ({ wolf, isYou }) => {
  const { t } = useTranslation();

  // Generate avatar
  const avatarSvg = useMemo(() => {
    if (!wolf?.avatar) return null;
    try {
      const avatar = createAvatar(avataaars, {
        ...wolf.avatar,
        size: 32,
      });
      return avatar.toDataUriSync();
    } catch {
      return null;
    }
  }, [wolf?.avatar]);

  const roleName = i18n.language === "fr" ? wolf.role?.nameFR : wolf.role?.name;
  const hasVoted = !!wolf.hasWolfVotedFor;

  return (
    <div className={`flex items-center gap-3 rounded-lg px-3 py-2 ${isYou ? 'bg-red-900/40 border border-red-500/30' : 'bg-slate-800/50'}`}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-600 flex-shrink-0">
        {avatarSvg ? (
          <img src={avatarSvg} alt={wolf.name} className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">
          {wolf.name}
          {isYou && <span className="text-red-400 text-xs ml-1">({t("game.you") || "You"})</span>}
        </p>
        <p className="text-red-400 text-xs truncate">{roleName}</p>
      </div>

      {/* Vote Status */}
      <div className="flex-shrink-0">
        {hasVoted ? (
          <div className="flex items-center gap-1 bg-red-800/50 rounded px-2 py-1">
            <span className="text-xs">🗳️</span>
            <span className="text-white text-xs font-medium truncate max-w-[80px]">
              {wolf.hasWolfVotedFor}
            </span>
          </div>
        ) : (
          <span className="text-slate-500 text-xs italic">
            {t("game.notVotedYet") || "Thinking..."}
          </span>
        )}
      </div>
    </div>
  );
};

export default WolfVoteTracker;
