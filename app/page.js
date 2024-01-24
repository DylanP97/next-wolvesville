"use client";

import AppHeader from "./components/AppHeader";
import HomePage from "./components/Home/HomePage";
import Connexion from "./components/Home/Connexion";
import { useAuth } from "./providers/AuthProvider";

export default function Home() {
  const { username, isConnected, socketId, isInAGame, roomPlaying } = useAuth();

  return (
    <div>
      {isConnected ? (
        <>
          {
            isInAGame ? (
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
