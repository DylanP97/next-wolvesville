"use client";

import CmdVote from "./PlayingCommands/CmdVote";
import CmdPerform1 from "./PlayingCommands/CmdPerform1";
import CmdPerform2 from "./PlayingCommands/CmdPerform2";
import { useGame } from "../../providers/GameProvider";
import { useAuth } from "../../../providers/AuthProvider";

const PlayingCommands = () => {
  const { socket } = useAuth();

  const {
    clientPlayer,
    timeOfTheDay,
    isSelection,
    setIsSelection,
    isDoubleSelection,
    setIsDoubleSelection,
    isBlocked,
    setActionType,
    gameId,
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
    } = {},
  } = clientPlayer;

  const activateSelection = (actionType) => {
    if (!isBlocked) {
      setIsSelection(!isSelection);
      setActionType(actionType);
    } else {
      console.log(
        "you already select something, now selection mode is blocked"
      );
    }
  };

  const activateDoubleSelection = (actionType) => {
    if (!isBlocked) {
      setIsDoubleSelection(!isDoubleSelection);
      setActionType(actionType);
    } else {
      console.log(
        "you already select something now, doubleSelection mode is blocked"
      );
    }
  };

  const noSelectionAction = (actionType) => {
    if (clientPlayer.role.name === "Mayor" && actionType === "assertDuty") {
      socket.emit("assertDuty", clientPlayer.name, gameId);
    }
  };

  return (
    <>
      {timeOfTheDay === "votetime" && canVote && (
        <CmdVote
          activateSelection={activateSelection}
          isSelection={isSelection}
          wolfVote={false}
        />
      )}
      {timeOfTheDay === "nighttime" &&
        clientPlayer.role.team.join() === "werewolves" && (
          <CmdVote
            activateSelection={activateSelection}
            isSelection={isSelection}
            wolfVote={true}
          />
        )}
      {canPerform && (
        <CmdPerform1
          canPerform={canPerform}
          activateSelection={activateSelection}
          activateDoubleSelection={activateDoubleSelection}
          noSelectionAction={noSelectionAction}
        />
      )}
      {canPerform2 && (
        <CmdPerform2
          canPerform2={canPerform2}
          activateSelection={activateSelection}
          rolename={name}
        />
      )}
    </>
  );
};

export default PlayingCommands;
