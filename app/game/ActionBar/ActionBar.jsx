"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGame } from "../GameProvider";
import PlayingCommands from "./PlayingCommands";
import PauseToggle from "./PauseToggle";
import ChatButton from "./ChatButton";
import GameMenuExitBtn from "../../general-btns/GameMenuExitBtn";
import RolesChecklistToggle from "../RolesChecklistToggle";
import RoleGuideOverlay from "../RoleGuideOverlay";

const ActionBar = ({ summaryIsOpen, setSummaryIsOpen, rolesChecklistOpen, setRolesChecklistOpen, isChatOpen, setIsChatOpen }) => {
  const { clientPlayer } = useGame();

  return (
    <div className="w-full py-2 container mx-auto flex flex-row gap-4 justify-center overflow-x-auto scrollbar-hide py-2 px-8 z-30">
      {clientPlayer.isAlive && <PlayingCommands />}
      {/* Only show chat button on mobile */}
      {/* <div className="md:hidden">
        <ChatButton isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      </div> */}
      <RoleGuideOverlay />
      <RolesChecklistToggle
        rolesChecklistOpen={rolesChecklistOpen}
        setRolesChecklistOpen={setRolesChecklistOpen}
      />
      <GameMenuExitBtn />
      <PauseToggle />
    </div>
  );
};

export default ActionBar;