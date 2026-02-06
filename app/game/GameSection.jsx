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
import PersistentMobileChat from "./ActionBar/PersistentMobileChat";
import { useGame } from "./GameProvider";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import GameMenuExitOverlay from "./GameMenuExitOverlay";
import { useToRender } from "../providers/RenderProvider";
import MedievalVillageDaytimeBackground from "./Backgrounds/MedievalVillageDaytimeBackground";
import MedievalVillageNighttimeBackground from "./Backgrounds/MedievalVillageNighttimeBackground";
import MedievalVillageVotetimeBackground from "./Backgrounds/MedievalVillageVotetimeBackground";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";
import Image from "next/image";
import RolesChecklist from "./RolesChecklist";

const GameSection = ({ summaryIsOpen, setSummaryIsOpen, rolesChecklistOpen, setRolesChecklistOpen }) => {
  const { winningTeam, timeOfTheDay, clientPlayer } = useGame();
  const { width, height } = useWindowSize();
  const { exitMenuOpen, toggleExitMenu } = useToRender();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const { t } = useTranslation();

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
          {getBackgroundComponent()}
          {winningTeam !== null ? (
            <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
              <Confetti
                width={containerSize.width}
                height={containerSize.height}
                style={{ zIndex: "999" }}
              />
              <div className="absolute inset-0 p-3 md:p-6 overflow-y-auto pointer-events-auto">
                <WinnerOverlay />
              </div>
            </div>
          ) : (
            <>
              <GameGrid />
              <PrisonOverlay />
            </>
          )}

          {/* Remove this block completely */}
          {/* <div className="md:hidden">
            <ChatModal isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
          </div> */}

        </div>

        {/* Chat sidebar for desktop */}
        <div className="hidden md:flex w-80 lg:w-[500px] h-full z-30 flex-col min-h-0">
          <ChatModal isSidebar={true} />
        </div>
      </div>

      {/* Roles Checklist Panel */}
      {rolesChecklistOpen && (
        <RolesChecklist
          rolesChecklistOpen={rolesChecklistOpen}
          setRolesChecklistOpen={setRolesChecklistOpen}
        />
      )}

      <div className="bg-slate-800 border-b border-slate-600 shadow-2xl bottom-0 left-0 right-0 relative overflow-hidden z-30">
        {/* Persistent mobile chat - always visible */}
        <div className="md:hidden bg-slate-900 border-t border-slate-700">
          <PersistentMobileChat />
        </div>

        {/* Action Bar */}
        <ActionBar
          summaryIsOpen={summaryIsOpen}
          setSummaryIsOpen={setSummaryIsOpen}
          rolesChecklistOpen={rolesChecklistOpen}
          setRolesChecklistOpen={setRolesChecklistOpen}
        // isChatOpen={isChatOpen}
        // setIsChatOpen={setIsChatOpen}
        />


        {/* Role Description */}
        <div className="p-2 mb-4">
          <p className="text-xs md:text-sm italic text-center">
            {t("game.youAre")}{" "}
            {i18n.language === "fr" ? clientPlayer.role.nameFR : clientPlayer.role.name}{" "}
            -{" "}
            {i18n.language === "fr"
              ? clientPlayer.role.descriptionFR
              : clientPlayer.role.description}
          </p>
        </div>
        <Image
          src={clientPlayer.role.image}
          alt={clientPlayer.role.name}
          width={250}
          height={250}
          className="opacity-10 absolute -bottom-12 -right-6 object-contain z-20 pointer-events-none select-none"
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