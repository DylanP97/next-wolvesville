"use client";

import { useMemo } from "react";
import { useGame } from "../../GameProvider";
import { useTranslation } from "react-i18next";
import i18n from "../../../lib/i18n";

/**
 * AftermathPanel - Shows what happened during the aftermath phase
 *
 * Night Aftermath: Shows wolf kills, SK kills, etc.
 * Vote Aftermath: Shows who was voted out
 */
const AftermathPanel = () => {
  const { t } = useTranslation();
  const { timeOfTheDay, playersList, dayCount } = useGame();

  const isNightAftermath = timeOfTheDay === "nighttimeAftermath";
  const isVoteAftermath = timeOfTheDay === "votetimeAftermath";

  // Find players who died this phase (based on causeOfDeath)
  const recentDeaths = useMemo(() => {
    if (!playersList) return [];

    // Get players who died recently (not alive)
    const deadPlayers = playersList.filter(p => !p.isAlive && p.causeOfDeath);

    // For aftermath, we show all deaths (the backend handles which deaths happened this phase)
    return deadPlayers;
  }, [playersList]);

  // Group deaths by cause for night aftermath
  const deathsByCause = useMemo(() => {
    if (!isNightAftermath) return null;

    const groups = {
      wolves: [],
      murder: [],
      poison: [],
      ghost: [],
      fire: [],
      other: [],
    };

    recentDeaths.forEach(player => {
      switch (player.causeOfDeath) {
        case "wolves":
          groups.wolves.push(player);
          break;
        case "murder":
          groups.murder.push(player);
          break;
        case "poison":
          groups.poison.push(player);
          break;
        case "ghost":
          groups.ghost.push(player);
          break;
        case "fire":
          groups.fire.push(player);
          break;
        default:
          groups.other.push(player);
      }
    });

    return groups;
  }, [isNightAftermath, recentDeaths]);

  // Find the lynched player for vote aftermath
  const lynchedPlayer = useMemo(() => {
    if (!isVoteAftermath) return null;
    return recentDeaths.find(p => p.causeOfDeath === "lynch");
  }, [isVoteAftermath, recentDeaths]);

  if (!isNightAftermath && !isVoteAftermath) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-4xl mb-2 block">
          {isNightAftermath ? "🌅" : "⚖️"}
        </span>
        <h2 className="text-white text-xl font-bold">
          {isNightAftermath
            ? (t("game.aftermath.nightTitle") || "Dawn breaks...")
            : (t("game.aftermath.voteTitle") || "The village has spoken...")
          }
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {isNightAftermath
            ? (t("game.aftermath.nightSubtitle") || "Here's what happened during the night")
            : (t("game.aftermath.voteSubtitle") || "The verdict is in")
          }
        </p>
      </div>

      {/* Night Aftermath Events */}
      {isNightAftermath && deathsByCause && (
        <div className="w-full max-w-md space-y-3">
          {/* Wolves kill */}
          {deathsByCause.wolves.length > 0 && (
            <AftermathEvent
              emoji="🐺"
              color="red"
              title={t("game.aftermath.wolvesKilled") || "The wolves killed"}
              players={deathsByCause.wolves}
            />
          )}

          {/* Serial Killer */}
          {deathsByCause.murder.length > 0 && (
            <AftermathEvent
              emoji="🔪"
              color="purple"
              title={t("game.aftermath.skKilled") || "The Serial Killer murdered"}
              players={deathsByCause.murder}
            />
          )}

          {/* Witch poison */}
          {deathsByCause.poison.length > 0 && (
            <AftermathEvent
              emoji="☠️"
              color="green"
              title={t("game.aftermath.poisoned") || "Poisoned"}
              players={deathsByCause.poison}
            />
          )}

          {/* Ghost Lady */}
          {deathsByCause.ghost.length > 0 && (
            <AftermathEvent
              emoji="👻"
              color="blue"
              title={t("game.aftermath.ghostKilled") || "The Ghost Lady killed"}
              players={deathsByCause.ghost}
            />
          )}

          {/* Arsonist fire */}
          {deathsByCause.fire.length > 0 && (
            <AftermathEvent
              emoji="🔥"
              color="orange"
              title={t("game.aftermath.burned") || "Burned alive"}
              players={deathsByCause.fire}
            />
          )}

          {/* Other deaths */}
          {deathsByCause.other.length > 0 && (
            <AftermathEvent
              emoji="💀"
              color="slate"
              title={t("game.aftermath.otherDeaths") || "Also died"}
              players={deathsByCause.other}
            />
          )}

          {/* No deaths */}
          {Object.values(deathsByCause).every(arr => arr.length === 0) && (
            <div className="text-center py-6">
              <span className="text-4xl mb-2 block">✨</span>
              <p className="text-green-400 font-medium">
                {t("game.aftermath.peacefulNight") || "A peaceful night... no one died"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Vote Aftermath */}
      {isVoteAftermath && (
        <div className="w-full max-w-md">
          {lynchedPlayer ? (
            <AftermathEvent
              emoji="🗳️"
              color="red"
              title={t("game.aftermath.villageVoted") || "The village voted to eliminate"}
              players={[lynchedPlayer]}
              showRole
            />
          ) : (
            <div className="text-center py-6">
              <span className="text-4xl mb-2 block">🤷</span>
              <p className="text-yellow-400 font-medium">
                {t("game.aftermath.noConsensus") || "No consensus was reached... no one was eliminated"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * AftermathEvent - Single event card showing who died
 */
const AftermathEvent = ({ emoji, color, title, players, showRole = false }) => {
  const colorClasses = {
    red: "bg-red-900/30 border-red-500/50",
    purple: "bg-purple-900/30 border-purple-500/50",
    green: "bg-green-900/30 border-green-500/50",
    blue: "bg-blue-900/30 border-blue-500/50",
    orange: "bg-orange-900/30 border-orange-500/50",
    slate: "bg-slate-800/50 border-slate-500/50",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color] || colorClasses.slate} animate-fadeIn`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div className="flex-1">
          <p className="text-slate-300 text-sm">{title}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {players.map(player => (
              <span key={player.id} className="text-white font-semibold">
                {player.name}
                {showRole && player.role && (
                  <span className="text-slate-400 font-normal ml-1">
                    ({i18n.language === "fr" ? player.role.nameFR : player.role.name})
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AftermathPanel;
