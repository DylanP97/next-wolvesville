"use client";

import Connexion from "../components/Connexion";
import GameMain from "./components/GameMain";
import { useAuth } from "../providers/AuthProvider";
import { GameProvider } from "./providers/GameProvider";
import { InGameKeysProvider } from "./providers/InGameKeysProvider";

export default function GamePage() {
  const { isConnected } = useAuth();

  return (
    <div className="flex flex-col flex-grow">
      {isConnected ? (
        <GameProvider>
          <InGameKeysProvider>
            <GameMain />
          </InGameKeysProvider>
        </GameProvider>
      ) : (
        <Connexion />
      )}
    </div>
  );
}
