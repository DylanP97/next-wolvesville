"use client";

import Image from "next/image";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import { useMemo } from "react";
import i18n from "../../../lib/i18n";

/**
 * PlayerListItem - A single player row for voting/action lists
 */
const PlayerListItem = ({
  player,
  onAction,
  actionLabel,
  actionEmoji,
  voteCount,
  isSelected,
  isLeading,
  disabled,
  showRole,
}) => {
  // Generate avatar (sync version to avoid Promise issues)
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

  const roleName = i18n.language === "fr" ? player?.role?.nameFR : player?.role?.name;

  return (
    <div
      className={`
        flex items-center justify-between px-4 py-3
        border-b border-slate-700/50
        ${isSelected ? 'bg-blue-600/30 border-l-4 border-l-blue-500' : ''}
        ${isLeading ? 'bg-yellow-600/20' : ''}
        ${disabled ? 'opacity-50' : ''}
      `}
    >
      {/* Player info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
          {avatarSvg ? (
            <img src={avatarSvg} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400" />
          )}
        </div>

        {/* Name and role */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{player.name}</p>
          {showRole && player.isRevealed && (
            <p className="text-xs text-slate-400 truncate">
              {roleName}
            </p>
          )}
        </div>

        {/* Vote count bar */}
        {voteCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${isLeading ? 'bg-yellow-500' : 'bg-blue-500'} transition-all`}
                style={{ width: `${Math.min(voteCount * 20, 100)}%` }}
              />
            </div>
            <span className="text-white text-sm font-bold min-w-[24px]">{voteCount}</span>
          </div>
        )}
      </div>

      {/* Action button */}
      {onAction && !disabled && (
        <button
          onClick={() => onAction(player)}
          className={`
            ml-3 px-4 py-2 rounded-lg font-medium text-sm
            transition-all active:scale-95
            ${isSelected
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
            }
          `}
        >
          {actionEmoji && <span className="mr-1">{actionEmoji}</span>}
          {actionLabel}
        </button>
      )}

      {/* Selected indicator */}
      {isSelected && !onAction && (
        <span className="text-green-400 text-xl">✓</span>
      )}
    </div>
  );
};

export default PlayerListItem;
