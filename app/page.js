"use client";

import AppHeader from "./components/AppHeader";
import HomePage from "./components/Home/HomePage";
import Connexion from "./components/Home/Connexion";
import { useAuth } from "./providers/AuthProvider";
import GamePage from "./components/Game/GamePage";

export default function Home() {
  const { username, isConnected, socketId, isInRoom } = useAuth();

  return (
    <div>
      {isConnected ? (
        <>
          {
            isInRoom ? (
              <GamePage />
            ) : (
              <>
                <AppHeader username={username} socketId={socketId} />
                <HomePage />
              </>
            )
          }
        </>
      ) : (
        <Connexion />
      )}
    </div>
  );
}
