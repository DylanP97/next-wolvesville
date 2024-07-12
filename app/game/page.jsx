"use client";

import Connexion from "../connexion/Connexion";
import GameMain from "./GameMain";
import { useAuth } from "../providers/AuthProvider";
import { GameProvider } from "./providers/GameProvider";
import { InGameKeysProvider } from "./providers/InGameKeysProvider";
import { GameAnimationsProvider } from "./providers/GameAnimationsProvider";
import { useState } from "react";
import SideSummary from "./GameMain/SideSummary";

export default function GamePage() {
  const [summaryIsOpen, setSummaryIsOpen] = useState(false);
  const { isConnected, isInRoom, isPlaying, game } = useAuth();

  return (
    <div className="flex flex-col flex-grow">
      {isConnected && game ? (
        <GameProvider>
          <InGameKeysProvider>
            <GameAnimationsProvider>
              <div className="flex flex-col flex-grow">
                <GameMain
                  summaryIsOpen={summaryIsOpen}
                  setSummaryIsOpen={setSummaryIsOpen}
                />
              </div>
              {summaryIsOpen && (
                <SideSummary
                  summaryIsOpen={summaryIsOpen}
                  setSummaryIsOpen={setSummaryIsOpen}
                />
              )}
            </GameAnimationsProvider>
          </InGameKeysProvider>
        </GameProvider>
      ) : (
        <Connexion />
      )}
    </div>
  );
}
