"use client";

import { useGame } from "./GameProvider";
import Chatbox from "./Chatbox";
import PlayingCommands from "./PlayingCommands";
import SideSummaryToggle from "./SideSummaryToggle";
import PauseToggle from "./PauseToggle"

const ActionBar = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { clientPlayer } = useGame();

  return (
    <div className="flex flex-row w-full h-10">
      <PauseToggle />
      {/* <SideSummaryToggle
        summaryIsOpen={summaryIsOpen}
        setSummaryIsOpen={setSummaryIsOpen}
      /> */}
      {clientPlayer.isAlive && <Chatbox />} 
      {clientPlayer.isAlive && <PlayingCommands />}
    </div>
  );
};

export default ActionBar;
