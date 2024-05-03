"use client";

import Connexion from "../components/Connexion";
import GameMain from "./components/GameMain";
import { useAuth } from "../providers/AuthProvider";
import { GameProvider } from "./providers/GameProvider";
import { KeysProvider } from "./providers/KeysProvider";

export default function GamePage() {
  const { isConnected } = useAuth();

  return (
    <>
      {isConnected ? (
        <GameProvider>
          <KeysProvider>
            <GameMain />
          </KeysProvider>
        </GameProvider>
      ) : (
        <Connexion />
      )}
    </>
  );
}
