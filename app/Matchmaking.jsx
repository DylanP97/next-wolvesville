"use client";

import { useState, useEffect, memo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "./providers/AuthProvider";
import { Card, CardBody, CardHeader, Progress } from "@nextui-org/react";
import AvatarUI from "./components/AvatarUI";

// Memoized player card component to prevent re-renders
const PlayerCard = memo(({ player, isCurrentUser }) => {
  return (
    <div className="flex flex-col items-center gap-2 p-3">
      <AvatarUI avatar={player.avatar} heightAndWidth={80} />
      <span className="text-sm font-medium text-zinc-300 truncate w-full text-center">
        {isCurrentUser ? (
          <span className="text-primary font-bold">{player.username} (You)</span>
        ) : (
          player.username
        )}
      </span>
    </div>
  );
});

PlayerCard.displayName = "PlayerCard";

const Matchmaking = () => {
  const { t, i18n } = useTranslation();
  const { socket, username, socketId, avatar } = useAuth();

  const [matchmakingStatus, setMatchmakingStatus] = useState({
    playerCount: 0,
    players: [],
    secondsRemaining: 20,
    isCountdownActive: false
  });

  useEffect(() => {
    if (!socket) return;

    let matchFound = false;

    // Listen for matchmaking updates
    const handleMatchmakingUpdate = (status) => {
      console.log("Matchmaking update received:", status);
      setMatchmakingStatus(status);
    };

    // Listen for match found
    const handleMatchFound = (data) => {
      console.log("Match found!", data);
      matchFound = true; // Don't leave queue in cleanup
    };

    // Register listeners FIRST
    socket.on("matchmakingUpdate", handleMatchmakingUpdate);
    socket.on("matchFound", handleMatchFound);

    // THEN auto-join queue - use socket.id instead of socketId from auth
    console.log("Auto-joining matchmaking queue with socket.id:", socket.id);
    socket.emit("joinMatchmaking", username, socket.id, avatar, i18n.language || 'fr');

    return () => {
      // Only leave queue if match wasn't found (user manually left)
      if (!matchFound) {
        console.log("Leaving matchmaking queue...");
        socket.emit("leaveMatchmaking", username);
      }
      socket.off("matchmakingUpdate", handleMatchmakingUpdate);
      socket.off("matchFound", handleMatchFound);
    };
  }, [socket, username, avatar]);

  const progressPercentage = matchmakingStatus.isCountdownActive
    ? ((20 - matchmakingStatus.secondsRemaining) / 20) * 100
    : (matchmakingStatus.playerCount / 16) * 100;

  const progressLabel = matchmakingStatus.isCountdownActive
    ? `Game starting in ${matchmakingStatus.secondsRemaining} seconds`
    : `${matchmakingStatus.playerCount} of 16 players in queue`;

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <Card className="w-full max-w-2xl bg-zinc-900/90 backdrop-blur border border-zinc-800">
        <CardHeader className="flex flex-col gap-2 pb-0">
          <h2 className="text-3xl font-bold text-center font-wolf text-primary">
            {t("matchmaking.searching") || "🔍 Searching for Match"}
          </h2>
        </CardHeader>

        <CardBody className="gap-6 py-6">
          <>
              {/* Player count */}
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {matchmakingStatus.playerCount}/16
                </div>
                <p className="text-zinc-400 text-lg">
                  {t("matchmaking.playersWaiting") || "Players in Queue"}
                </p>
              </div>

              {/* Countdown timer */}
              {matchmakingStatus.isCountdownActive && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">
                    {matchmakingStatus.secondsRemaining}s
                  </div>
                  <p className="text-zinc-400">
                    {t("matchmaking.startingIn") || "Game starting in..."}
                  </p>
                </div>
              )}

              {/* Progress bar */}
              <Progress
                value={progressPercentage}
                color="primary"
                size="lg"
                className="max-w-md mx-auto"
                showValueLabel={false}
                aria-label={progressLabel}
              />

              {/* Players list */}
              <div className="bg-zinc-950/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">
                  {t("matchmaking.playersList") || "Players in Queue:"}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {matchmakingStatus.players.map((player, index) => (
                    <PlayerCard
                      key={player.username || index}
                      player={player}
                      isCurrentUser={player.username === username}
                    />
                  ))}
                </div>
              </div>

              {/* Waiting message */}
              {!matchmakingStatus.isCountdownActive && matchmakingStatus.playerCount < 2 && (
                <p className="text-center text-zinc-500 text-sm animate-pulse">
                  {t("matchmaking.waiting") || "Waiting for more players to join..."}
                </p>
              )}
            </>
        </CardBody>
      </Card>
    </div>
  );
};

export default Matchmaking;
