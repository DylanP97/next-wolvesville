"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useGame } from "../../GameProvider";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import i18n from "../../../lib/i18n";

/**
 * VillageView - Fun 2D view showing avatars walking around
 *
 * Features:
 * - Alive players walk around randomly
 * - Dead players shown as ghosts in a cemetery area
 * - Day/night visual changes
 */
const VillageView = () => {
  const { playersList, timeOfTheDay, clientPlayer } = useGame();

  const isNight = timeOfTheDay?.includes("night");
  const alivePlayers = useMemo(() => playersList?.filter(p => p.isAlive) || [], [playersList]);
  const deadPlayers = useMemo(() => playersList?.filter(p => !p.isAlive) || [], [playersList]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${isNight
      ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950'
      : 'bg-gradient-to-b from-sky-400 via-sky-300 to-green-400'
      }`}
    >
      {/* Sky elements */}
      {isNight ? (
        <>
          {/* Moon */}
          <div className="absolute top-4 right-8 w-12 h-12 rounded-full bg-yellow-100 shadow-lg shadow-yellow-100/50" />
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 30}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </>
      ) : (
        <>
          {/* Sun */}
          <div className="absolute top-4 right-8 w-14 h-14 rounded-full bg-yellow-300 shadow-lg shadow-yellow-300/50" />
          {/* Clouds */}
          <div className="absolute top-8 left-[10%] w-16 h-6 bg-white/80 rounded-full" />
          <div className="absolute top-12 left-[15%] w-10 h-4 bg-white/80 rounded-full" />
          <div className="absolute top-6 left-[60%] w-20 h-8 bg-white/80 rounded-full" />
        </>
      )}

      {/* Ground */}
      <div className={`absolute bottom-0 left-0 right-0 h-[40%] ${isNight
        ? 'bg-gradient-to-t from-slate-800 to-slate-700'
        : 'bg-gradient-to-t from-green-600 to-green-500'
        }`}
      >
        {/* Grass texture lines */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-0.5 h-3 ${isNight ? 'bg-green-900' : 'bg-green-700'} rounded-full`}
              style={{
                bottom: `${Math.random() * 20}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Houses */}
      <div className="absolute bottom-[35%] left-[5%]">
        <House color={isNight ? "slate" : "amber"} />
      </div>
      <div className="absolute bottom-[35%] right-[10%]">
        <House color={isNight ? "slate" : "rose"} />
      </div>

      {/* Cemetery area for dead players */}
      {deadPlayers.length > 0 && (
        <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2">
          <div className="flex items-end gap-2">
            {deadPlayers.slice(0, 5).map((player, index) => (
              <GhostAvatar key={player.id} player={player} delay={index * 0.5} />
            ))}
          </div>
          {/* Tombstones */}
          <div className="flex gap-4 mt-2 justify-center">
            {deadPlayers.slice(0, 5).map((_, i) => (
              <div key={i} className="w-4 h-6 bg-slate-500 rounded-t-lg" />
            ))}
          </div>
        </div>
      )}

      {/* Walking avatars */}
      {alivePlayers.map((player, index) => (
        <WalkingAvatar
          key={player.id}
          player={player}
          isClient={player.id === clientPlayer?.id}
          index={index}
          total={alivePlayers.length}
        />
      ))}

      {/* Player count */}
      <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5">
        <p className="text-white text-xs">
          <span className="text-green-400">{alivePlayers.length}</span>
          <span className="text-slate-400"> alive</span>
          {deadPlayers.length > 0 && (
            <>
              <span className="text-slate-500 mx-1">·</span>
              <span className="text-red-400">{deadPlayers.length}</span>
              <span className="text-slate-400"> dead</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

/**
 * House - Simple house decoration
 */
const House = ({ color }) => {
  const colors = {
    amber: "bg-amber-700",
    rose: "bg-rose-800",
    slate: "bg-slate-700",
  };

  return (
    <div className="relative">
      {/* Roof */}
      <div className={`w-0 h-0 border-l-[24px] border-r-[24px] border-b-[20px] border-l-transparent border-r-transparent ${color === "slate" ? "border-b-slate-600" : "border-b-red-900"}`} />
      {/* Body */}
      <div className={`w-12 h-10 ${colors[color]}`}>
        {/* Window */}
        <div className="absolute top-[22px] left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-200/80 rounded-sm" />
        {/* Door */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-amber-900 rounded-t-sm" />
      </div>
    </div>
  );
};

/**
 * WalkingAvatar - Animated avatar that walks around
 */
const WalkingAvatar = ({ player, isClient, index, total }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const animationRef = useRef(null);

  // Generate avatar
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

  // Initialize position based on index
  useEffect(() => {
    const startX = 10 + (index / total) * 70;
    const startY = 50 + Math.random() * 10;
    setPosition({ x: startX, y: startY });
  }, [index, total]);

  // Random walking animation
  useEffect(() => {
    const walk = () => {
      setPosition(prev => {
        let newX = prev.x + (direction * (0.5 + Math.random() * 0.5));
        let newDirection = direction;

        // Bounce off edges
        if (newX > 85) {
          newX = 85;
          newDirection = -1;
        } else if (newX < 5) {
          newX = 5;
          newDirection = 1;
        }

        // Random direction change
        if (Math.random() < 0.02) {
          newDirection = -newDirection;
        }

        setDirection(newDirection);

        return {
          x: newX,
          y: prev.y + (Math.random() - 0.5) * 0.5,
        };
      });

      animationRef.current = setTimeout(walk, 100 + Math.random() * 100);
    };

    animationRef.current = setTimeout(walk, Math.random() * 2000);

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [direction]);

  const roleName = i18n.language === "fr" ? player.role?.nameFR : player.role?.name;

  return (
    <div
      className="absolute transition-all duration-100 ease-linear"
      style={{
        left: `${position.x}%`,
        bottom: `${position.y - 15}%`,
        transform: `scaleX(${direction})`,
      }}
    >
      {/* Avatar */}
      <div className={`relative ${isClient ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent rounded-full' : ''}`}>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-600 shadow-lg">
          {avatarSvg ? (
            <img src={avatarSvg} alt={player.name} className="w-full h-full" style={{ transform: `scaleX(${direction})` }} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400" />
          )}
        </div>

        {/* Walking animation legs */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-1.5 h-2 bg-slate-700 rounded-b-full animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="w-1.5 h-2 bg-slate-700 rounded-b-full animate-bounce" style={{ animationDelay: "0.15s" }} />
        </div>
      </div>

      {/* Name tag */}
      <div
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{ transform: `translateX(-50%) scaleX(${direction})` }}
      >
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isClient
          ? 'bg-yellow-500/80 text-black font-bold'
          : 'bg-black/50 text-white'
          }`}>
          {player.name}
        </span>
      </div>
    </div>
  );
};

/**
 * GhostAvatar - Ghost version for dead players
 */
const GhostAvatar = ({ player, delay }) => {
  // Generate avatar
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
    <div
      className="relative opacity-50 animate-pulse"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Ghost effect */}
      <div className="w-8 h-8 rounded-full overflow-hidden grayscale">
        {avatarSvg ? (
          <img src={avatarSvg} alt={player.name} className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600" />
        )}
      </div>
      {/* Ghost aura */}
      <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
    </div>
  );
};

export default VillageView;
