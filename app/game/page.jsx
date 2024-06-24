"use client";

import Connexion from "../connexion/Connexion";
import GameMain from "./GameMain";
import { useAuth } from "../providers/AuthProvider";
import { GameProvider } from "./providers/GameProvider";
import { InGameKeysProvider } from "./providers/InGameKeysProvider";
import { useState } from "react";
import SideSummary from "./GameMain/SideSummary";

export default function GamePage() {
  const { isConnected } = useAuth();
  const [summaryIsOpen, setSummaryIsOpen] = useState(false);
  const { game } = useAuth();

  return (
    <div className="flex flex-col flex-grow">
      {isConnected && game ? (
        <GameProvider>
          <InGameKeysProvider>
            <GameMain
              summaryIsOpen={summaryIsOpen}
              setSummaryIsOpen={setSummaryIsOpen}
            />
            {summaryIsOpen && (
              <SideSummary
                summaryIsOpen={summaryIsOpen}
                setSummaryIsOpen={setSummaryIsOpen}
              />
            )}
          </InGameKeysProvider>
        </GameProvider>
      ) : (
        <Connexion />
      )}
    </div>
  );
}
