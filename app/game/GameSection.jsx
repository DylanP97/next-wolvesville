"use client";

import WinnerOverlay from "./WinnerOverlay";
import ActionBar from "./ActionBar";
import DeathFlash from "./DeathFlash";
import NightmareOverlay from "./NightmareOverlay";
import GameHeader from "./GameHeader";
import GameGrid from "./GameGrid";
import ChatModal from "./ChatModal";
import { useGame } from "./GameProvider";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import GameMenuExitOverlay from "./GameMenuExitOverlay";
import { useToRender } from "../providers/RenderProvider";
import MedievalVillageDaytimeBackground from "./MedievalVillageDaytimeBackground";
import MedievalVillageNighttimeBackground from "./MedievalVillageNighttimeBackground";
import MedievalVillageVotetimeBackground from "./MedievalVillageVotetimeBackground";

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

      {/* Header fixe en haut */}
      <div className="z-30">
        <GameHeader />
      </div>

      {/* Container principal avec padding pour header et action bar */}
      <div className="flex flex-grow flex-1 justify-center items-center">
          <GameGrid />
      </div>

      {/* Action Bar fixe en bas */}
      <div className="bottom-0 left-0 right-0 z-30">
        <ActionBar
          summaryIsOpen={summaryIsOpen}
          setSummaryIsOpen={setSummaryIsOpen}
        />
      </div>

      {winningTeam !== null && (
        <>
          <Confetti width={width} height={height} style={{ zIndex: "999" }} />
          <WinnerOverlay />
        </>
      )}
      <GameMenuExitOverlay
        isOpen={exitMenuOpen}
        onClose={toggleExitMenu}
      />
      <ChatModal />
    </div>
  );
};

export default GameSection;