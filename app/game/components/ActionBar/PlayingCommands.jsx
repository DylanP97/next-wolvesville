"use client";

import CmdVote from "./PlayingCommands/CmdVote";
import CmdPerform1 from "./PlayingCommands/CmdPerform1";
import CmdPerform2 from "./PlayingCommands/CmdPerform2";
import { useGame } from "../../providers/GameProvider";

const PlayingCommands = () => {
  const {
    clientPlayer,
    timeOfTheDay,
    isSelection,
    setIsSelection,
    isDoubleSelection,
    setIsDoubleSelection,
    isBlocked,
    setActionType,
  } = useGame();

  const {
    role: {
      canVote,
      canPerform,
      canPerform2,
      name,
      bombPower,
      playersToSetOnFire,
      partner,
    } = {}
  } = clientPlayer;

  const activateSelection = (action) => {
    if (!isBlocked) {
      setIsSelection(!isSelection);
      setActionType(action);
    } else {
      console.log("you already select something now selection mode is blocked");
    }
  };

  const activateDoubleSelection = (action) => {
    if (!isBlocked) {
      setIsDoubleSelection(!isDoubleSelection);
      setActionType(action);
    } else {
      console.log(
        "you already select something now doubleSelection mode is blocked"
      );
    }
  };

  return (
    <div className="z-20">
      {timeOfTheDay === "votetime" && canVote && (
        <CmdVote
          activateSelection={activateSelection}
          isSelection={isSelection}
        />
      )}
      {canPerform && (
        <CmdPerform1
          canPerform={canPerform}
          activateSelection={activateSelection}
          activateDoubleSelection={activateDoubleSelection}
        />
      )}
      {canPerform2 && (
        <CmdPerform2
          canPerform2={canPerform2}
          activateSelection={activateSelection}
          rolename={name}
        />
      )}
    </div>
  );
};

export default PlayingCommands;
