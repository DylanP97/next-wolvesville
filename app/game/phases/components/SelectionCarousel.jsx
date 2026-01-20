"use client";

import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import i18n from "../../../lib/i18n";

/**
 * SelectionCarousel - Grid/carousel of selectable players
 */
const SelectionCarousel = ({ players, onSelect, actionEmoji, actionLabel }) => {
  if (!players || players.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 italic">
        No targets available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-2 overflow-y-auto max-h-full">
      {players.map(player => (
        <SelectablePlayer
          key={player.id}
          player={player}
          onSelect={onSelect}
          actionEmoji={actionEmoji}
          actionLabel={actionLabel}
        />
      ))}
    </div>
  );
};

/**
 * SelectablePlayer - A single selectable player card
 */
const SelectablePlayer = ({ player, onSelect, actionEmoji, actionLabel }) => {
  const avatarSvg = useMemo(() => {
    if (!player?.avatar) return null;
    try {
      const avatar = createAvatar(avataaars, {
        ...player.avatar,
        size: 80,
      });
      return avatar.toDataUriSync();
    } catch {
      return null;
    }
  }, [player?.avatar]);

  const roleName = player.isRevealed
    ? (i18n.language === "fr" ? player.role?.nameFR : player.role?.name)
    : null;

  // For dead players (cemetery view)
  const isDead = !player.isAlive;

  return (
    <button
      onClick={() => onSelect(player)}
      className={`
        flex flex-col items-center p-3 rounded-xl transition-all active:scale-95
        ${isDead
          ? 'bg-slate-800 hover:bg-slate-700 border border-slate-600'
          : 'bg-slate-700 hover:bg-slate-600 border border-slate-500'
        }
      `}
    >
      {/* Avatar */}
      <div className={`relative w-14 h-14 rounded-full overflow-hidden mb-2 ${isDead ? 'grayscale' : ''}`}>
        {avatarSvg ? (
          <img src={avatarSvg} alt={player.name} className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400" />
        )}

        {/* Death marker for cemetery */}
        {isDead && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="text-2xl">⚰️</span>
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-white font-medium text-sm truncate w-full text-center">
        {player.name}
      </p>

      {/* Role if revealed or dead */}
      {(roleName || isDead) && (
        <p className="text-xs text-slate-400 truncate w-full text-center">
          {isDead ? (i18n.language === "fr" ? player.role?.nameFR : player.role?.name) : roleName}
        </p>
      )}

      {/* Action indicator */}
      <div className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-full text-xs text-white flex items-center gap-1">
        <span>{actionEmoji}</span>
        <span>{actionLabel}</span>
      </div>
    </button>
  );
};

export default SelectionCarousel;
