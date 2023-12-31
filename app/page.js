"use client";

import AppHeader from "./components/AppHeader";
import HomePage from "./components/Home/HomePage";
import Connexion from "./components/Home/Connexion";
import { useAuth } from "./providers/AuthProvider";

export default function Home() {
  const { username, isConnected, socketId } = useAuth();

  return (
    <div>
      {isConnected ? (
        <>
          <AppHeader username={username} socketId={socketId} />
          <HomePage />
        </>
      ) : (
        <Connexion />
      )}
    </div>
  );
}
