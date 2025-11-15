"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGame } from "./GameProvider";
import PlayingCommands from "./PlayingCommands";
import PauseToggle from "./PauseToggle"
import ChatModal from "./ChatModal";
import { Tooltip } from "@nextui-org/react";

const ActionBar = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { clientPlayer, usedChat, actionType } = useGame();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { divActionIcon } = require("../lib/styles");
  const { t } = useTranslation();

  return (
    <>
      <div className="fixed pb-6 bottom-0 left-0 right-0 flex flex-row w-full h-36 z-20 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700 shadow-2xl items-center justify-center gap-4">
        <PauseToggle />
        {clientPlayer.isAlive && <PlayingCommands />}
        <Tooltip content={t("game.tooltip.seeOrWriteMessage")} color="secondary" variant="flat">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`${divActionIcon} ${isChatOpen ? "bg-blue-600 hover:bg-blue-800" : "bg-slate-900 hover:bg-slate-700"}`}
          >
            <span className="text-3xl">💬</span>
          </button>
        </Tooltip>
      </div>
      {actionType && <p>selection is: {actionType}</p>}
      <ChatModal isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </>
  );
};

export default ActionBar;
