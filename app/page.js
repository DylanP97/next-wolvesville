"use client";

import AppHeader from "./components/AppHeader";
import HomePage from "./components/Home/HomePage";
import Connexion from "./components/Home/Connexion";
import { useAuth } from "./providers/AuthProvider";

export default function Home() {
  const { username, isConnected } = useAuth();

  return (
    <div>
      {isConnected ? (
        <>
          <AppHeader username={username} />
          <HomePage />
        </>
      ) : (
        <Connexion />
      )}
    </div>
  );
}
