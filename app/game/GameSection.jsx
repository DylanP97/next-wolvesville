"use client";

import WinnerOverlay from "./WinnerOverlay/WinnerOverlay";
import DeathFlash from "./Overlays/DeathFlash";
import DeathOverlay from "./Overlays/DeathOverlay";
import ActionGameLayout from "./phases/ActionGameLayout";
import { useGame } from "./GameProvider";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import GameMenuExitOverlay from "./GameMenuExitOverlay";
import { useToRender } from "../providers/RenderProvider";
import { useEffect, useRef, useState } from "react";

const GameSection = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { winningTeam } = useGame();
  const { width, height } = useWindowSize();
  const { exitMenuOpen, toggleExitMenu } = useToRender();
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col">
      <DeathFlash />
      {winningTeam === null && <DeathOverlay />}

      {winningTeam !== null ? (
        // Winner screen with confetti
        <div className="flex-1 relative overflow-hidden">
          <Confetti
            width={containerSize.width}
            height={containerSize.height}
            style={{ zIndex: "999", position: "absolute" }}
          />
          <div className="absolute inset-0 p-3 md:p-6 overflow-y-auto">
            <WinnerOverlay />
          </div>
        </div>
      ) : (
        // Main game - ActionGameLayout handles everything
        <ActionGameLayout />
      )}

      <GameMenuExitOverlay
        isOpen={exitMenuOpen}
        onClose={toggleExitMenu}
      />
    </div>
  );
};

export default GameSection;
