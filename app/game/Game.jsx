"use client";

import Connexion from "../connexion/Connexion";
import GameSection from "./GameSection";
import { useAuth } from "../providers/AuthProvider";
import { GameProvider } from "./GameProvider";
import { InGameKeysProvider } from "./InGameKeysProvider";
import { useState } from "react";

export default function Game() {
  const [summaryIsOpen, setSummaryIsOpen] = useState(false);
  const { isConnected, game } = useAuth();

  return (
    <div className="flex flex-col flex-grow pb-20">
      {isConnected && game ? (
        <GameProvider>
          <InGameKeysProvider>
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
          </InGameKeysProvider>
        </GameProvider>
      ) : (
        <Connexion />
      )}
    </div>
  );
}
