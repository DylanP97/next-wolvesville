"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import i18n from "../../../lib/i18n";
import Image from "next/image";

/**
 * SelectablePlayerCard - Compact, touch-friendly player card for target selection
 *
 * Used in SelectionScreen to display valid targets.
 * Shows avatar, name, role (if revealed), and status indicators.
 * Compact on mobile to fit more players without scrolling.
 */
const SelectablePlayerCard = ({
  player,
  onSelect,
  actionEmoji,
  isSelected = false,
  showRole = false,
}) => {
  const { t } = useTranslation();

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
        relative flex flex-col items-center p-2 sm:p-3 rounded-xl
        transition-all duration-150 ease-out
        ${isSelected
          ? 'bg-green-600 ring-2 ring-green-400 scale-[1.02]'
          : 'bg-slate-700/80 hover:bg-slate-600 active:scale-95'
        }
        ${!player.isAlive ? 'opacity-60' : ''}
      `}
    >
      {/* Avatar or Role Icon - smaller on mobile */}
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-600 mb-1">
        {roleImage ? (
          <Image
            src={roleImage}
            alt={roleName || "Role"}
            width={48}
            height={48}
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
            <span className="text-lg">💀</span>
          </div>
        )}
      </div>

      {/* Player name - smaller text */}
      <p className="text-white font-medium text-xs sm:text-sm truncate max-w-full leading-tight">
        {player.name}
      </p>

      {/* Role name (if revealed) */}
      {roleName && (
        <p className="text-yellow-400 text-[10px] sm:text-xs truncate max-w-full">
          {roleName}
        </p>
      )}

      {/* Status indicators */}
      {player.isUnderArrest && (
        <span className="text-xs absolute top-1 left-1" title={t("game.tooltip.underArrest") || "Under arrest"}>👮</span>
      )}

      {/* Selection checkmark */}
      {isSelected && (
        <div className="absolute top-1 right-1 bg-green-500 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
          <span className="text-white text-[10px] sm:text-xs">✓</span>
        </div>
      )}
    </button>
  );
};

export default SelectablePlayerCard;
