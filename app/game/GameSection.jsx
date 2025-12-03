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

const GameSection = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { winningTeam, timeOfTheDay } = useGame();
  const { width, height } = useWindowSize();
  const { exitMenuOpen, toggleExitMenu } = useToRender();


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
    <div className="relative w-full h-full flex flex-col ">
      {getBackgroundComponent()}
      <DeathFlash />
      <NightmareOverlay />
      <DeathOverlay />

      {/* Header fixe en haut */}
      <div className="z-30">
        <GameHeader />
      </div>

      {/* Container principal avec padding pour header et action bar */}
      <div className="flex flex-grow flex-1 justify-center items-center relative">
        <GameGrid />
        <PrisonOverlay />
        {winningTeam !== null && (
          <>
            <Confetti width={width} height={height} style={{ zIndex: "999" }} />
            <WinnerOverlay />
          </>
        )}
      </div>

      {/* Action Bar fixe en bas */}
      <div className="bottom-0 left-0 right-0 z-30">
        <ActionBar
          summaryIsOpen={summaryIsOpen}
          setSummaryIsOpen={setSummaryIsOpen}
        />
      </div>

      <GameMenuExitOverlay
        isOpen={exitMenuOpen}
        onClose={toggleExitMenu}
      />
      <ChatModal />
    </div>
  );
};

export default GameSection;