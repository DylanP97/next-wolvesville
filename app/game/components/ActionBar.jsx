"use client";

import Chatbox from "./ActionBar/Chatbox";
import PlayingCommands from "./ActionBar/PlayingCommands";

const ActionBar = () => {
  return (
    <div className="flex flex-row w-full border b-2 border-red-500">
      <Chatbox />
      <PlayingCommands />
    </div>
  );
};

export default ActionBar;
