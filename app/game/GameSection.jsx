"use client";

import WinnerOverlay from "./WinnerOverlay/WinnerOverlay";
import ActionBar from "./ActionBar/ActionBar";
import DeathFlash from "./Overlays/DeathFlash";
import NightmareOverlay from "./Overlays/NightmareOverlay";
import DeathOverlay from "./Overlays/DeathOverlay";
import PrisonOverlay from "./Overlays/PrisonOverlay";
import GameHeader from "./GameHeader";
import GameGrid from "./GameGrid/GameGrid";
import ChatModal from "./ActionBar/ChatModal";
import { useGame } from "./GameProvider";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import GameMenuExitOverlay from "./GameMenuExitOverlay";
import { useToRender } from "../providers/RenderProvider";
import MedievalVillageDaytimeBackground from "./Backgrounds/MedievalVillageDaytimeBackground";
import MedievalVillageNighttimeBackground from "./Backgrounds/MedievalVillageNighttimeBackground";
import MedievalVillageVotetimeBackground from "./Backgrounds/MedievalVillageVotetimeBackground";
import { useEffect, useRef, useState } from "react";

const GameSection = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { winningTeam, timeOfTheDay } = useGame();
  const { width, height } = useWindowSize();
  const { exitMenuOpen, toggleExitMenu } = useToRender();
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  const getBackgroundComponent = () => {
    switch (timeOfTheDay) {
      case "daytime":
        return <MedievalVillageDaytimeBackground />;
      case "votetime":
      case "votetimeAftermath":
        return <MedievalVillageVotetimeBackground />;
      case "nighttime":
      case "nighttimeAftermath":
        return <MedievalVillageNighttimeBackground />;
      default:
        return <MedievalVillageNighttimeBackground />;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {getBackgroundComponent()}
      <DeathFlash />
      <NightmareOverlay />
      {winningTeam === null && <DeathOverlay />}

      {/* Header */}
      <div className="z-30">
        <GameHeader />
      </div>

      {/* Main content area with sidebar on desktop */}
      <div className="flex flex-grow flex-1 relative min-h-0 overflow-hidden">
        {/* Game content */}
        <div ref={containerRef} className="flex flex-grow flex-1 justify-center items-center relative">
          {winningTeam !== null ? (
            <div className="w-full h-full overflow-hidden flex flex-col">
              <Confetti
                width={containerSize.width}
                height={containerSize.height}
                style={{ zIndex: "999" }}
              />
              <WinnerOverlay />
            </div>
          ) : (
            <>
              <GameGrid />
              <PrisonOverlay />
            </>
          )}

          {/* Chat modal for mobile */}
          <div className="md:hidden">
            <ChatModal isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
          </div>
        </div>

        {/* Chat sidebar for desktop */}
        <div className="hidden md:flex w-80 lg:w-[500px] h-full z-30 flex-col min-h-0">
          <ChatModal isSidebar={true} />
        </div>
      </div>

      {/* Action Bar */}
      <div className="bottom-0 left-0 right-0 z-30">
        <ActionBar
          summaryIsOpen={summaryIsOpen}
          setSummaryIsOpen={setSummaryIsOpen}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
        />
      </div>

      <GameMenuExitOverlay
        isOpen={exitMenuOpen}
        onClose={toggleExitMenu}
      />
    </div>
  );
};

export default GameSection;