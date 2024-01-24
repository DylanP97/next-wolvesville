"use client"

import Connexion from "../components/Home/Connexion";
import JoinRoom from "../components/Room/JoinRoom";
import GamePage from "../components/Game/GamePage";
import { useAuth } from "../providers/AuthProvider";

export default function JoinRoomPage() {
  const { isConnected, isInAGame } = useAuth();

  return (
    <div>
      {isConnected ? (
        <>
          {
            isInAGame ? (
              <GamePage />
            ) : (
              <JoinRoom />
            )
          }
        </>
      ) : (
        <Connexion />
      )}
    </div>
  );
}