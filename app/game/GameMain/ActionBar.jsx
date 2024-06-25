"use client";

import { useGame } from "../providers/GameProvider";
import Chatbox from "./ActionBar/Chatbox";
import PlayingCommands from "./ActionBar/PlayingCommands";
import SideSummaryToggle from "./ActionBar/SideSummaryToggle";
import PauseToggle from "./PauseToggle"

const ActionBar = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { clientPlayer } = useGame();

  return (
    <div className="flex flex-row w-full h-12">
      <PauseToggle />
      <SideSummaryToggle
        summaryIsOpen={summaryIsOpen}
        setSummaryIsOpen={setSummaryIsOpen}
      />
      <Chatbox />
      {clientPlayer.isAlive && <PlayingCommands />}
    </div>
  );
};

export default ActionBar;
