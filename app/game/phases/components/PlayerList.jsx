"use client";

import { useMemo } from "react";
import { useGame } from "../../GameProvider";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import i18n from "../../../lib/i18n";
import Image from "next/image";

/**
 * PlayerList - Compact grid of all players with selection capability
 */
const PlayerList = ({
  selectionTargets = [],
  onSelect = null,
  actionEmoji = null,
  actionLabel = null,
  isActionDone = false,
}) => {
  const { playersList, clientPlayer, timeOfTheDay } = useGame();

  const isVoteTime = timeOfTheDay === "votetime" || timeOfTheDay === "votetimeAftermath";
  const isNightTime = timeOfTheDay === "nighttime" || timeOfTheDay === "nighttimeAftermath";
  const isWolf = clientPlayer?.role?.team === "Werewolves";

  // Create a set of selectable player IDs for quick lookup
  const selectableIds = useMemo(() => {
    return new Set(selectionTargets.map(p => p.id));
  }, [selectionTargets]);

  const hasSelection = selectableIds.size > 0 && onSelect && !isActionDone;

  // Sort: alive first, then by vote count during vote time
  const sortedPlayers = useMemo(() => {
    return [...playersList].sort((a, b) => {
      // Dead players at bottom
      if (a.isAlive !== b.isAlive) return b.isAlive ? 1 : -1;
      // During vote time, sort by votes
      if (isVoteTime) {
        return (b.voteAgainst || 0) - (a.voteAgainst || 0);
      }
      return 0;
    });
  }, [playersList, isVoteTime]);

  return (
    <div className="bg-slate-800/50 p-3">
      {/* Action header when selection is active */}
      {hasSelection && (
        <div className="flex items-center justify-center gap-2 mb-3 pb-2 border-b border-slate-600">
          <span className="text-2xl">{actionEmoji}</span>
          <span className="text-white font-medium">{actionLabel}</span>
          <span className="text-slate-400 text-sm">- tap a player</span>
        </div>
      )}

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[50vh] overflow-y-auto">
        {sortedPlayers.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            isClient={player.id === clientPlayer?.id}
            showVotes={isVoteTime}
            showWolfVotes={isNightTime && isWolf}
            isSelectable={selectableIds.has(player.id)}
            onSelect={hasSelection ? onSelect : null}
            actionEmoji={actionEmoji}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * PlayerCard - Compact player card with avatar/role and status
 */
const PlayerCard = ({
  player,
  isClient,
  showVotes,
  showWolfVotes,
  isSelectable = false,
  onSelect = null,
  actionEmoji = null,
}) => {
  // Generate avatar
  const avatarSvg = useMemo(() => {
    if (!player?.avatar) return null;
    try {
      const avatar = createAvatar(avataaars, {
        ...player.avatar,
        size: 48,
      });
      return avatar.toDataUriSync();
    } catch {
      return null;
    }
  }, [player?.avatar]);

  const role = player.role;
  const roleName = player.isRevealed
    ? (i18n.language === "fr" ? role?.nameFR : role?.name)
    : null;

  const voteCount = showVotes ? (player.voteAgainst || 0) : 0;
  const wolfVoteCount = showWolfVotes ? (player.wolfVoteAgainst || 0) : 0;

  const handleClick = () => {
    if (isSelectable && onSelect) {
      onSelect(player);
    }
  };

  // Show role icon instead of avatar when revealed
  const showRoleIcon = player.isRevealed && role?.image;

  const cardContent = (
    <div
      className={`
        relative flex flex-col items-center p-2 rounded-lg transition-all
        ${!player.isAlive ? 'opacity-40 grayscale' : ''}
        ${isClient ? 'bg-blue-600/30 ring-2 ring-blue-500' : 'bg-slate-700/50'}
        ${player.isRevealed ? 'ring-1 ring-yellow-500/50' : ''}
        ${isSelectable ? 'ring-2 ring-green-400 cursor-pointer hover:bg-slate-600 active:scale-95' : ''}
        ${!isSelectable && onSelect ? 'opacity-30' : ''}
      `}
    >
      {/* Avatar or Role Icon */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-600">
        {showRoleIcon ? (
          <Image
            src={role.image}
            alt={roleName || "Role"}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : avatarSvg ? (
          <img src={avatarSvg} alt={player.name} className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400" />
        )}

        {/* Death indicator */}
        {!player.isAlive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-xl">💀</span>
          </div>
        )}

        {/* Arrest indicator */}
        {player.isUnderArrest && (
          <div className="absolute -top-1 -right-1 text-sm">👮</div>
        )}

        {/* Nightmare indicator */}
        {player.willHaveNightmares && (
          <div className="absolute -top-1 -right-1 text-sm">😱</div>
        )}
      </div>

      {/* Name */}
      <p className="text-xs text-white truncate w-full text-center mt-1">
        {player.name}
      </p>

      {/* Role (if revealed) */}
      {roleName && (
        <p className="text-[10px] text-yellow-400 truncate w-full text-center">
          {roleName}
        </p>
      )}

      {/* Vote count badges */}
      {voteCount > 0 && (
        <div className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {voteCount}
        </div>
      )}
      {wolfVoteCount > 0 && (
        <div className="absolute -top-1 -left-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          🐺{wolfVoteCount}
        </div>
      )}

      {/* Selection indicator */}
      {isSelectable && actionEmoji && (
        <div className="absolute -bottom-1 right-0 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {actionEmoji}
        </div>
      )}
    </div>
  );

  if (isSelectable && onSelect) {
    return (
      <button onClick={handleClick} className="w-full">
        {cardContent}
      </button>
    );
  }

  return cardContent;
};

export default PlayerList;
