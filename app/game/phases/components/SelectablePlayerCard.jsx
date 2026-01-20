"use client";

import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import i18n from "../../../lib/i18n";
import Image from "next/image";

/**
 * SelectablePlayerCard - Large, touch-friendly player card for target selection
 *
 * Used in SelectionScreen to display valid targets.
 * Shows avatar, name, role (if revealed), and status indicators.
 */
const SelectablePlayerCard = ({
  player,
  onSelect,
  actionEmoji,
  isSelected = false,
  showRole = false,
}) => {
  // Generate avatar
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

  const role = player.role;
  const roleName = player.isRevealed || showRole
    ? (i18n.language === "fr" ? role?.nameFR : role?.name)
    : null;
  const roleImage = (player.isRevealed || showRole) && role?.image ? role.image : null;

  const handleClick = () => {
    if (onSelect) {
      onSelect(player);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative flex flex-col items-center p-4 rounded-2xl
        transition-all duration-200 ease-out
        ${isSelected
          ? 'bg-green-600 ring-4 ring-green-400 scale-105'
          : 'bg-slate-700/80 hover:bg-slate-600 active:scale-95'
        }
        ${!player.isAlive ? 'opacity-60' : ''}
      `}
    >
      {/* Avatar or Role Icon */}
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-600 mb-2">
        {roleImage ? (
          <Image
            src={roleImage}
            alt={roleName || "Role"}
            width={64}
            height={64}
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
            <span className="text-2xl">💀</span>
          </div>
        )}
      </div>

      {/* Player name */}
      <p className="text-white font-medium text-sm truncate max-w-full">
        {player.name}
      </p>

      {/* Role name (if revealed) */}
      {roleName && (
        <p className="text-yellow-400 text-xs truncate max-w-full mt-0.5">
          {roleName}
        </p>
      )}

      {/* Status indicators */}
      <div className="flex gap-1 mt-1">
        {player.isUnderArrest && (
          <span className="text-sm" title="Under arrest">👮</span>
        )}
        {player.willHaveNightmares && (
          <span className="text-sm" title="Having nightmares">😱</span>
        )}
        {player.isMarkedWithGasoline && (
          <span className="text-sm" title="Marked with gasoline">⛽</span>
        )}
        {player.isProtected && (
          <span className="text-sm" title="Protected">🛡️</span>
        )}
      </div>

      {/* Action indicator on hover */}
      {actionEmoji && (
        <div className="absolute top-2 right-2 bg-black/40 rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-lg">{actionEmoji}</span>
        </div>
      )}

      {/* Selection checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>
      )}
    </button>
  );
};

export default SelectablePlayerCard;
