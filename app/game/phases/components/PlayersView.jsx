"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import { useGame } from "../../GameProvider";
import i18n from "../../../lib/i18n";
import Image from "next/image";

/**
 * PlayersView - View component for Players and Roles info (not a modal)
 *
 * Features:
 * - Players tab: Shows all players (alive/dead) with reveal status
 * - Roles tab: Shows all roles with player assignment info
 * - Cause of death for dead players
 */
const PlayersView = () => {
  const { t } = useTranslation();
  const { playersList, rolesInGame } = useGame();
  const [activeTab, setActiveTab] = useState("players");

  // Separate alive and dead players
  const { alivePlayers, deadPlayers } = useMemo(() => {
    const alive = (playersList || []).filter(p => p.isAlive);
    const dead = (playersList || []).filter(p => !p.isAlive);
    return { alivePlayers: alive, deadPlayers: dead };
  }, [playersList]);

  // Group roles by team with player info
  const rolesByTeam = useMemo(() => {
    if (!rolesInGame || !playersList) return { village: [], wolves: [], solo: [] };

    // Create role cards with player assignment info
    const enrichedRoles = rolesInGame.map(role => {
      // Find player with this role who is revealed
      const revealedPlayer = playersList.find(p =>
        p.isRevealed && p.role?.name === role.name
      );

      // Check if role holder is dead (and therefore revealed)
      const deadPlayer = playersList.find(p =>
        !p.isAlive && p.role?.name === role.name
      );

      return {
        ...role,
        assignedPlayer: revealedPlayer || deadPlayer,
        isRevealed: !!(revealedPlayer || deadPlayer),
        isDead: !!deadPlayer,
      };
    });

    const village = enrichedRoles.filter(r => r.team === "Village");
    const wolves = enrichedRoles.filter(r => r.team === "Werewolves");
    const solo = enrichedRoles.filter(r => r.team !== "Village" && r.team !== "Werewolves");

    return { village, wolves, solo };
  }, [rolesInGame, playersList]);

  return (
    <div className="flex flex-col h-full bg-slate-900/80">
      {/* Tabs */}
      <div className="flex-shrink-0 flex bg-slate-800 border-b border-slate-700">
        <button
          onClick={() => setActiveTab("players")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "players"
              ? "text-white border-blue-500 bg-slate-700/50"
              : "text-slate-400 border-transparent hover:text-white hover:bg-slate-700/30"
          }`}
        >
          👥 {t("game.players") || "Players"} ({playersList?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 ${
            activeTab === "roles"
              ? "text-white border-blue-500 bg-slate-700/50"
              : "text-slate-400 border-transparent hover:text-white hover:bg-slate-700/30"
          }`}
        >
          🎭 {t("game.roles") || "Roles"} ({rolesInGame?.length || 0})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "players" ? (
          <PlayersTab
            alivePlayers={alivePlayers}
            deadPlayers={deadPlayers}
            t={t}
          />
        ) : (
          <RolesTab rolesByTeam={rolesByTeam} t={t} />
        )}
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 px-4 py-2 bg-slate-800 border-t border-slate-700">
        <div className="flex justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>{t("game.village") || "Village"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>{t("game.wolves") || "Wolves"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span>{t("game.solo") || "Solo"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * PlayersTab - Shows alive and dead players
 */
const PlayersTab = ({ alivePlayers, deadPlayers, t }) => (
  <div className="p-3">
    {/* Alive section */}
    {alivePlayers.length > 0 && (
      <div className="mb-4">
        <h3 className="text-green-400 text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          {t("game.alive") || "Alive"} ({alivePlayers.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {alivePlayers.map((player) => (
            <PlayerCard key={player.id} player={player} t={t} />
          ))}
        </div>
      </div>
    )}

    {/* Dead section */}
    {deadPlayers.length > 0 && (
      <div>
        <h3 className="text-red-400 text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          {t("game.dead") || "Dead"} ({deadPlayers.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {deadPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} isDead t={t} />
          ))}
        </div>
      </div>
    )}

    {alivePlayers.length === 0 && deadPlayers.length === 0 && (
      <div className="text-center text-slate-500 py-8">
        {t("game.noPlayers") || "No players"}
      </div>
    )}
  </div>
);

/**
 * RolesTab - Shows all roles with player assignment
 */
const RolesTab = ({ rolesByTeam, t }) => (
  <div className="p-3 space-y-4">
    {/* Village roles */}
    {rolesByTeam.village.length > 0 && (
      <div>
        <h3 className="text-green-400 text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          {t("game.village") || "Village"} ({rolesByTeam.village.length})
        </h3>
        <div className="space-y-2">
          {rolesByTeam.village.map((role, index) => (
            <RoleCard key={`village-${index}`} role={role} t={t} />
          ))}
        </div>
      </div>
    )}

    {/* Wolf roles */}
    {rolesByTeam.wolves.length > 0 && (
      <div>
        <h3 className="text-red-400 text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          {t("game.wolves") || "Werewolves"} ({rolesByTeam.wolves.length})
        </h3>
        <div className="space-y-2">
          {rolesByTeam.wolves.map((role, index) => (
            <RoleCard key={`wolf-${index}`} role={role} t={t} />
          ))}
        </div>
      </div>
    )}

    {/* Solo roles */}
    {rolesByTeam.solo.length > 0 && (
      <div>
        <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          {t("game.solo") || "Solo"} ({rolesByTeam.solo.length})
        </h3>
        <div className="space-y-2">
          {rolesByTeam.solo.map((role, index) => (
            <RoleCard key={`solo-${index}`} role={role} t={t} />
          ))}
        </div>
      </div>
    )}

    {rolesByTeam.village.length === 0 && rolesByTeam.wolves.length === 0 && rolesByTeam.solo.length === 0 && (
      <div className="text-center text-slate-500 py-8">
        {t("game.noRoles") || "No roles information"}
      </div>
    )}
  </div>
);

/**
 * RoleCard - Shows a role with player assignment info
 */
const RoleCard = ({ role, t }) => {
  const displayName = i18n.language === "fr" ? role?.nameFR : role?.name;

  const teamColors = {
    "Werewolves": { border: "border-red-500/40", text: "text-red-300", bg: "bg-red-900/20" },
    "Village": { border: "border-green-500/40", text: "text-green-300", bg: "bg-green-900/20" },
  };
  const colors = teamColors[role?.team] || { border: "border-purple-500/40", text: "text-purple-300", bg: "bg-purple-900/20" };

  // Determine status
  const statusInfo = useMemo(() => {
    if (role.isRevealed && role.assignedPlayer) {
      return {
        text: role.assignedPlayer.name,
        color: role.isDead ? "text-red-400 line-through" : "text-yellow-400",
        emoji: role.isDead ? "💀" : "👤",
      };
    }
    return {
      text: t("game.roleUnknown") || "Unknown",
      color: "text-slate-500",
      emoji: "❓",
    };
  }, [role, t]);

  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-xl ${colors.bg} border ${colors.border}`}>
      {/* Role image */}
      <div className={`w-10 h-10 rounded-lg overflow-hidden bg-slate-600 flex-shrink-0 ${role.isDead ? 'grayscale opacity-60' : ''}`}>
        {role?.image ? (
          <Image
            src={role.image}
            alt={displayName}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400" />
        )}
      </div>

      {/* Role info */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${colors.text}`}>
          {displayName}
        </p>
        <p className={`text-xs ${statusInfo.color} flex items-center gap-1`}>
          <span>{statusInfo.emoji}</span>
          <span>{statusInfo.text}</span>
        </p>
      </div>

      {/* Status indicator */}
      {role.isRevealed && (
        <div className={`w-2 h-2 rounded-full ${role.isDead ? 'bg-red-500' : 'bg-yellow-500'}`} />
      )}
    </div>
  );
};

/**
 * PlayerCard - Compact card showing player status
 */
const PlayerCard = ({ player, isDead = false, t }) => {
  // Generate avatar
  const avatarSvg = useMemo(() => {
    if (!player?.avatar) return null;
    try {
      const avatar = createAvatar(avataaars, {
        ...player.avatar,
        size: 36,
      });
      return avatar.toDataUriSync();
    } catch {
      return null;
    }
  }, [player?.avatar]);

  const role = player.role;
  const isRevealed = player.isRevealed;
  const displayRoleName = isRevealed
    ? (i18n.language === "fr" ? role?.nameFR : role?.name)
    : "???";

  // Cause of death
  const causeDisplay = useMemo(() => {
    if (!isDead || !player.causeOfDeath) return null;

    const causes = {
      "lynch": { emoji: "⚖️", text: t("game.death.lynch") || "Voted out" },
      "wolves": { emoji: "🐺", text: t("game.death.wolves") || "Eaten" },
      "gunshot": { emoji: "🔫", text: t("game.death.gunshot") || "Shot" },
      "poison": { emoji: "☠️", text: t("game.death.poison") || "Poisoned" },
      "execution": { emoji: "⚔️", text: t("game.death.execution") || "Executed" },
      "fire": { emoji: "🔥", text: t("game.death.fire") || "Burned" },
      "murder": { emoji: "🔪", text: t("game.death.murder") || "Murdered" },
      "lover_suicide": { emoji: "💔", text: t("game.death.lover") || "Heartbreak" },
      "ghost": { emoji: "👻", text: t("game.death.ghost") || "Ghost" },
      "baby_wolf_revenge": { emoji: "👶", text: t("game.death.revenge") || "Revenge" },
    };

    return causes[player.causeOfDeath] || null;
  }, [isDead, player.causeOfDeath, t]);

  // Team color
  const teamColor = isRevealed
    ? role?.team === "Werewolves" ? "border-red-500/50"
      : role?.team === "Village" ? "border-green-500/50"
      : "border-purple-500/50"
    : "border-slate-600";

  const roleTextColor = isRevealed
    ? role?.team === "Werewolves" ? "text-red-400"
      : role?.team === "Village" ? "text-green-400"
      : "text-purple-400"
    : "text-slate-500";

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg bg-slate-700/40 border ${teamColor} ${isDead ? 'opacity-60' : ''}`}>
      {/* Avatar */}
      <div className={`relative w-9 h-9 rounded-full overflow-hidden bg-slate-600 flex-shrink-0 ${isDead ? 'grayscale' : ''}`}>
        {isRevealed && role?.image ? (
          <Image
            src={role.image}
            alt={displayRoleName}
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        ) : avatarSvg ? (
          <img src={avatarSvg} alt={player.name} className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400" />
        )}

        {/* Death indicator */}
        {isDead && causeDisplay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-xs">{causeDisplay.emoji}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-white text-xs font-medium truncate ${isDead ? 'line-through text-slate-400' : ''}`}>
          {player.name}
        </p>
        <p className={`text-[10px] truncate ${roleTextColor}`}>
          {displayRoleName}
        </p>
        {isDead && causeDisplay && (
          <p className="text-[10px] text-slate-400 flex items-center gap-1">
            <span>{causeDisplay.emoji}</span>
            <span>{causeDisplay.text}</span>
          </p>
        )}
      </div>

      {/* Status */}
      {player.isUnderArrest && (
        <span className="text-xs" title={t("game.tooltip.underArrest") || "Under arrest"}>👮</span>
      )}
    </div>
  );
};

export default PlayersView;
