"use client";

import Connexion from "../connexion/Connexion";
import GameSection from "./GameSection";
import RoleReveal from "./RoleReveal";
import RolesOverview from "./RolesOverview";
import { useAuth } from "../providers/AuthProvider";
import { GameProvider } from "./GameProvider";
import { InGameKeysProvider } from "./InGameKeysProvider";
import GameErrorBoundary from "./GameErrorBoundary";
import { useState } from "react";

export default function Game() {
  const [summaryIsOpen, setSummaryIsOpen] = useState(false);
  const [rolesChecklistOpen, setRolesChecklistOpen] = useState(false);
  const { isConnected, game, username } = useAuth();

  const clientPlayer = game?.playersList?.find((p) => p.name === username);
  const showRoleReveal = game?.showingRoleReveal && clientPlayer;
  const showRolesOverview = game?.showingRolesOverview && clientPlayer;

  return (
    <div className="flex flex-col flex-grow h-screen">
      {isConnected && game ? (
        <>
          {showRoleReveal ? (
            // Show role reveal screen
            <RoleReveal role={clientPlayer.role} onComplete={() => {}} />
          ) : showRolesOverview ? (
            // Show roles overview screen (after role reveal, before game)
            <RolesOverview
              rolesInGame={game.rolesInGame}
              usersInTheRoom={game.usersInTheRoom}
            />
          ) : (
            // Show normal game - wrapped in error boundary
            <GameErrorBoundary>
              <GameProvider>
                <InGameKeysProvider>
                  <div className="flex flex-col h-full">
                    <GameSection
                      summaryIsOpen={summaryIsOpen}
                      setSummaryIsOpen={setSummaryIsOpen}
                      rolesChecklistOpen={rolesChecklistOpen}
                      setRolesChecklistOpen={setRolesChecklistOpen}
                    />
                  </div>
                </InGameKeysProvider>
              </GameProvider>
            </GameErrorBoundary>
          )}
        </>
      ) : (
        <Connexion />
      )}
    </div>
  );
}