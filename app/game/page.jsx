"use client";

import GameArea from "../components/Game/GameArea";
import Connexion from "../components/Home/Connexion";
import { useAuth } from "../providers/AuthProvider";

export default function GamePage() {
  const { isConnected, game } = useAuth();

  return (
    <div>
      {isConnected ? (
        <GameArea playersList={game.playersList} />
      ) : (
        <Connexion />
      )}
    </div>
  )
};
