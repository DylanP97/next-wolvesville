"use client";

import { useMemo } from "react";
import { useGame } from "../GameProvider";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import PhaseHeader from "./components/PhaseHeader";
import PlayerListItem from "./components/PlayerListItem";

/**
 * VotePhaseView - Village voting phase
 * Shows: Player list with vote counts and vote buttons
 */
const VotePhaseView = () => {
  const { t } = useTranslation();
  const { socket } = useAuth();
  const {
    clientPlayer,
    playersList,
    aliveList,
    gameId,
    selectionState,
    selectionHelpers,
    dayCount,
    timeOfTheDay,
  } = useGame();

  // Sort players by vote count (descending)
  const sortedPlayers = useMemo(() => {
    return [...aliveList]
      .filter(p => p.id !== clientPlayer?.id) // Exclude self
      .sort((a, b) => (b.voteAgainst || 0) - (a.voteAgainst || 0));
  }, [aliveList, clientPlayer]);

  // Get leading player
  const leadingPlayer = sortedPlayers.find(p => (p.voteAgainst || 0) > 0);
  const maxVotes = leadingPlayer?.voteAgainst || 0;

  // Check if client has already voted
  const hasVoted = selectionHelpers.isActionBlocked('vote');
  const votedForId = selectionState.completedActions?.vote?.[0];
  const votedForPlayer = playersList.find(p => p.id === votedForId);

  // Handle vote
  const handleVote = (player) => {
    if (hasVoted || !clientPlayer?.isAlive) return;

    const nbr = clientPlayer.role.name === "Captain" && clientPlayer.isRevealed ? 3 : 1;

    socket.emit("addVote", {
      type: "addVote",
      playerId: clientPlayer.id,
      playerName: clientPlayer.name,
      selectedPlayerId: player.id,
      selectedPlayerName: player.name,
      nbr,
    }, gameId);

    selectionHelpers.startSelection('vote', '✉️');
    selectionHelpers.addPlayer(player);
    selectionHelpers.complete('vote');
  };

  const isAftermath = timeOfTheDay === "votetimeAftermath";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PhaseHeader
        title={isAftermath ? t("game.votetimeAftermath") : `${t("game.votetime") || "Vote"} ${dayCount}`}
        emoji="✉️"
        subtitle={isAftermath ? t("game.tooltip.voteResult") : t("game.tooltip.voteAgainst")}
      />

      {/* Leading player indicator */}
      {maxVotes > 0 && (
        <div className="bg-yellow-500/20 border-b border-yellow-500/30 px-4 py-2">
          <p className="text-yellow-200 text-sm text-center">
            Leading: <strong>{leadingPlayer?.name}</strong> ({maxVotes} votes)
          </p>
        </div>
      )}

      {/* Player list */}
      <div className="flex-1 overflow-y-auto bg-slate-900/50">
        {sortedPlayers.map((player) => (
          <PlayerListItem
            key={player.id}
            player={player}
            voteCount={player.voteAgainst || 0}
            isLeading={player.voteAgainst === maxVotes && maxVotes > 0}
            isSelected={votedForId === player.id}
            showRole={true}
            onAction={!hasVoted && !isAftermath && clientPlayer?.isAlive ? handleVote : null}
            actionLabel={t("game.tooltip.vote") || "Vote"}
            actionEmoji="✉️"
            disabled={hasVoted || isAftermath}
          />
        ))}
      </div>

      {/* Vote status footer */}
      <div className="border-t border-slate-700 bg-slate-800 px-4 py-3">
        {hasVoted ? (
          <div className="flex items-center justify-center gap-2 text-green-400">
            <span>✓</span>
            <span>
              {t("game.tooltip.votedFor") || "You voted for"}: <strong>{votedForPlayer?.name}</strong>
            </span>
          </div>
        ) : clientPlayer?.isAlive && !isAftermath ? (
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <span>{t("game.tooltip.selectToVote") || "Select a player to vote"}</span>
          </div>
        ) : !clientPlayer?.isAlive ? (
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <span>💀 {t("game.youDied") || "You are dead"}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <span>{t("game.tooltip.waitingResult") || "Waiting for result..."}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePhaseView;
