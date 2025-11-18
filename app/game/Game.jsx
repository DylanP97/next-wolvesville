"use client";

import Connexion from "../connexion/Connexion";
import GameSection from "./GameSection";
import RoleReveal from "./RoleReveal";
import { useAuth } from "../providers/AuthProvider";
import { GameProvider } from "./GameProvider";
import { InGameKeysProvider } from "./InGameKeysProvider";
import { useState } from "react";

export default function Game() {
  const [summaryIsOpen, setSummaryIsOpen] = useState(false);
  const { isConnected, game, username } = useAuth();

  const clientPlayer = game?.playersList?.find((p) => p.name === username);
  const showRoleReveal = game?.showingRoleReveal && clientPlayer;

  return (
    <div className="flex flex-col flex-grow overflow-y-hidden">
      {isConnected && game ? (
        <>
          {showRoleReveal ? (
            // Show role reveal screen
            <RoleReveal role={clientPlayer.role} onComplete={() => {}} />
          ) : (
            // Show normal game
            <GameProvider>
              <InGameKeysProvider>
                <div className="flex flex-col flex-grow">
                  <GameSection
                    summaryIsOpen={summaryIsOpen}
                    setSummaryIsOpen={setSummaryIsOpen}
                  />
                </div>
              </InGameKeysProvider>
            </GameProvider>
          )}
        </>
      ) : (
        <Connexion />
      )}
    </div>
  );
}