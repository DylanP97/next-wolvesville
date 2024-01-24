"use client"

import Connexion from "../components/Home/Connexion";
import CreateRoom from "../components/Room/CreateRoom";
import GamePage from "../components/Game/GamePage";
import { useAuth } from "../providers/AuthProvider";

export default function CreateRoomPage() {
  const { isConnected, isInAGame } = useAuth();

  return (
    <div>
      {isConnected ? (
        <>
          {
            isInAGame ? (
              <GamePage />
            ) : (
              <CreateRoom />
            )
          }
        </>
      ) : (
        <Connexion />
      )}
    </div>
  );
};