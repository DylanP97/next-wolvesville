"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGame } from "./GameProvider";
import PlayingCommands from "./PlayingCommands";
import PauseToggle from "./PauseToggle";
import ChatModal from "./ChatModal";
import ChatButton from "./ChatButton";

const ActionBar = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { clientPlayer, actionType } = useGame();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="fixed pb-6 bottom-0 left-0 right-0 flex flex-col w-full h-[22%] z-20 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700 shadow-2xl items-center justify-center gap-4">
        <h2>{t("game.actionBar.title")} </h2>
        <div className="flex flex-row gap-4">
          <PauseToggle />
          {clientPlayer.isAlive && <PlayingCommands />}
          <ChatButton isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
        </div>

      </div>
      <ChatModal isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </>
  );
};

export default ActionBar;