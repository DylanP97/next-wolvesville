"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGame } from "../../GameProvider";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

/**
 * VoteTracker - Shows live vote counts during vote phase
 * Displays who's leading and vote distribution
 */
const VoteTracker = () => {
  const { t } = useTranslation();
  const { playersList, aliveList } = useGame();

  // Calculate vote counts for each player
  const voteData = useMemo(() => {
    const voteCounts = {};

    // Initialize all alive players with 0 votes
    aliveList.forEach(player => {
      voteCounts[player.id] = {
        player,
        votes: 0,
        voters: [],
      };
    });

    // Count votes from alive players
    aliveList.forEach(player => {
      if (player.votedFor) {
        const targetId = player.votedFor;
        if (voteCounts[targetId]) {
          voteCounts[targetId].votes += player.voteWeight || 1;
          voteCounts[targetId].voters.push(player);
        }
      }
    });

    // Convert to array and sort by votes (descending)
    return Object.values(voteCounts)
      .filter(v => v.votes > 0)
      .sort((a, b) => b.votes - a.votes);
  }, [aliveList]);

  // Get the leader(s)
  const maxVotes = voteData.length > 0 ? voteData[0].votes : 0;
  const leaders = voteData.filter(v => v.votes === maxVotes && v.votes > 0);

  // Count how many have voted
  const votedCount = aliveList.filter(p => p.votedFor).length;
  const totalVoters = aliveList.length;

  return (
    <div className="flex flex-col h-full bg-slate-900/80">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗳️</span>
            <span className="text-white font-medium">{t("game.voteTracker.title") || "Vote Tracker"}</span>
          </div>
          <div className="text-slate-400 text-sm">
            {votedCount}/{totalVoters} {t("game.voteTracker.voted") || "voted"}
          </div>
        </div>
      </div>

      {/* Vote list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {voteData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <span className="text-4xl mb-3">🤔</span>
            <p className="text-sm">{t("game.voteTracker.noVotes") || "No votes yet..."}</p>
            <p className="text-xs text-slate-600 mt-1">{t("game.voteTracker.waiting") || "Waiting for players to vote"}</p>
          </div>
        ) : (
          <>
            {/* Leader indicator */}
            {leaders.length > 0 && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                  <span>⚠️</span>
                  <span>
                    {leaders.length === 1
                      ? (t("game.voteTracker.leading") || "Leading")
                      : (t("game.voteTracker.tied") || "Tied")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {leaders.map(({ player }) => (
                    <LeaderBadge key={player.id} player={player} votes={maxVotes} />
                  ))}
                </div>
              </div>
            )}

            {/* All votes */}
            {voteData.map(({ player, votes, voters }) => (
              <VoteRow
                key={player.id}
                player={player}
                votes={votes}
                voters={voters}
                isLeading={votes === maxVotes}
                maxVotes={maxVotes}
              />
            ))}
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex-shrink-0 px-4 py-2 bg-slate-800 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
              style={{ width: `${(votedCount / totalVoters) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-400">
            {Math.round((votedCount / totalVoters) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * LeaderBadge - Shows a player who's currently leading
 */
const LeaderBadge = ({ player, votes }) => {
  const avatarSvg = useMemo(() => {
    if (!player?.avatar) return null;
    try {
      const avatar = createAvatar(avataaars, {
        ...player.avatar,
        size: 32,
      });
      return avatar.toDataUriSync();
    } catch {
      return null;
    }
  }, [player?.avatar]);

  return (
    <div className="flex items-center gap-2 bg-red-900/40 px-3 py-1.5 rounded-full">
      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-600">
        {avatarSvg ? (
          <img src={avatarSvg} alt={player.name} className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-400 to-orange-400" />
        )}
      </div>
      <span className="text-white text-sm font-medium">{player.name}</span>
      <span className="text-red-300 text-xs">({votes})</span>
    </div>
  );
};

/**
 * VoteRow - Shows a player and their vote count
 */
const VoteRow = ({ player, votes, voters, isLeading, maxVotes }) => {
  const avatarSvg = useMemo(() => {
    if (!player?.avatar) return null;
    try {
      const avatar = createAvatar(avataaars, {
        ...player.avatar,
        size: 40,
      });
      return avatar.toDataUriSync();
    } catch {
      return null;
    }
  }, [player?.avatar]);

  // Calculate bar width as percentage of max votes
  const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;

  return (
    <div className={`relative rounded-lg overflow-hidden ${isLeading ? 'bg-red-900/20' : 'bg-slate-800/50'}`}>
      {/* Vote bar background */}
      <div
        className={`absolute inset-y-0 left-0 transition-all duration-500 ${
          isLeading ? 'bg-red-600/30' : 'bg-slate-600/30'
        }`}
        style={{ width: `${barWidth}%` }}
      />

      {/* Content */}
      <div className="relative flex items-center gap-3 p-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-600 flex-shrink-0">
          {avatarSvg ? (
            <img src={avatarSvg} alt={player.name} className="w-full h-full" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400" />
          )}
        </div>

        {/* Name and voters */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${isLeading ? 'text-red-300' : 'text-white'}`}>
            {player.name}
          </p>
          {voters.length > 0 && (
            <p className="text-xs text-slate-400 truncate">
              {voters.map(v => v.name).join(", ")}
            </p>
          )}
        </div>

        {/* Vote count */}
        <div className={`text-xl font-bold ${isLeading ? 'text-red-400' : 'text-slate-400'}`}>
          {votes}
        </div>
      </div>
    </div>
  );
};

export default VoteTracker;
