"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGame } from "../GameProvider";
import PlayingCommands from "./PlayingCommands";
import PauseToggle from "./PauseToggle";
import ChatButton from "./ChatButton";
import GameMenuExitBtn from "../../general-btns/GameMenuExitBtn";

const ActionBar = ({ summaryIsOpen, setSummaryIsOpen, isChatOpen, setIsChatOpen}) => {
  const { clientPlayer, actionType } = useGame();
  const { t } = useTranslation();

  return (
    <>
      <div className="w-full bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700 shadow-2xl py-4 opacity-70">
        <div className="container mx-auto flex flex-row gap-4 justify-center overflow-x-auto scrollbar-hide py-2 px-8">
          {clientPlayer.isAlive && <PlayingCommands />}
          {/* Only show chat button on mobile */}
          <div className="md:hidden">
            <ChatButton isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
          </div>
          <GameMenuExitBtn />
          <PauseToggle />
        </div>
      </div>
    </>
  );
};

export default ActionBar;