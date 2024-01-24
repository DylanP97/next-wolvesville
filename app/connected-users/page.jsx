"use client"

import ConnectedUsers from "../components/Room/ConnectedUsers";
import Connexion from "../components/Home/Connexion";
import GamePage from "../components/Game/GamePage";
import { useAuth } from "../providers/AuthProvider";

export default function ConnectedUsersPage() {
  const { isConnected, isInRoom } = useAuth();

  return (
    <div>
      {isConnected ? (
        <>
          {
            isInRoom ? (
              <GamePage />
            ) : (
              <ConnectedUsers />
            )
          }
        </>
      ) : (
        <Connexion />
      )}
    </div>
  );
}