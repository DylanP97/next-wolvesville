"use client";

import Connexion from "../connexion/Connexion";
import GameMain from "./components/GameMain";
import { useAuth } from "../providers/AuthProvider";
import { GameProvider } from "./providers/GameProvider";
import { InGameKeysProvider } from "./providers/InGameKeysProvider";
import { useState } from "react";
import SideSummary from "./components/SideSummary";

export default function GamePage() {
  const { isConnected } = useAuth();
  const [summaryIsOpen, setSummaryIsOpen] = useState(false);

  return (
    <div className="flex flex-col flex-grow">
      {isConnected ? (
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
