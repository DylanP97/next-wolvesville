"use client";

import Connexion from "../connexion/Connexion";
import GameSection from "./GameSection";
import { useAuth } from "../providers/AuthProvider";
import { GameProvider } from "./GameProvider";
import { InGameKeysProvider } from "./InGameKeysProvider";
import { GameAnimationsProvider } from "./GameAnimationsProvider";
import { useState } from "react";
import SideSummary from "./SideSummary";

export default function Game() {
  const [summaryIsOpen, setSummaryIsOpen] = useState(false);
  const { isConnected, game } = useAuth();

  return (
    <div className="flex flex-col flex-grow">
      {isConnected && game ? (
        <GameProvider>
          <InGameKeysProvider>
            <GameAnimationsProvider>
              <div className="flex flex-col flex-grow">
                <GameSection
                  summaryIsOpen={summaryIsOpen}
                  setSummaryIsOpen={setSummaryIsOpen}
                />
              </div>
              {/* {summaryIsOpen && (
                <SideSummary
                  summaryIsOpen={summaryIsOpen}
                  setSummaryIsOpen={setSummaryIsOpen}
                />
              )} */}
            </GameAnimationsProvider>
          </InGameKeysProvider>
        </GameProvider>
      ) : (
        <Connexion />
      )}
    </div>
  );
}
