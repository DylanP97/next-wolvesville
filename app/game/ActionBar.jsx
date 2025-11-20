"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGame } from "./GameProvider";
import PlayingCommands from "./PlayingCommands";
import PauseToggle from "./PauseToggle";
import ChatModal from "./ChatModal";
import ChatButton from "./ChatButton";
import TopExitMenuBtn from "../general-btns/components/TopExitMenuBtn";

const ActionBar = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { clientPlayer, actionType } = useGame();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="w-full bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700 shadow-2xl py-4 pb-16">
        <div className="container mx-auto">
          <h2 className="text-white text-center mb-4 text-sm">{t("game.actionBar.title")}</h2>
          <div className="flex flex-row gap-4 justify-center">
            {/* <div className="fixed top-0 left-0 mx-1 z-50"> */}
              <TopExitMenuBtn />
            {/* </div> */}
            <PauseToggle />
            {clientPlayer.isAlive && <PlayingCommands />}
            <ChatButton isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
          </div>
        </div>
      </div>
      <ChatModal isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </>
  );
};

export default ActionBar;