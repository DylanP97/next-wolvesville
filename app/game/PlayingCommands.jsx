"use client";

import CmdVote from "./CmdVote";
import CmdPerform from "./CmdPerform";
import { useGame } from "./GameProvider";
import { useAuth } from "../providers/AuthProvider";
import { useGameAnimations } from "./GameAnimationsProvider";

const PlayingCommands = () => {
  const { socket } = useAuth();
  const { triggerSimpleMessage } = useGameAnimations();

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

  const { role: { canVote, canPerform1, canPerform2 } = {} } = clientPlayer;

  const activateSelection = (actionType) => {
    if (!isBlocked) {
      setIsSelection(!isSelection);
      setActionType(actionType);
    } else {
      triggerSimpleMessage(
        "you already select something, now selection mode is blocked"
      );
    }
  };

  const activateDoubleSelection = (actionType) => {
    if (!isBlocked) {
      setIsDoubleSelection(!isDoubleSelection);
      setActionType(actionType);
    } else {
      triggerSimpleMessage(
        "you already select something, now doubleSelection mode is blocked"
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
        clientPlayer.role.team === "Werewolves" && (
          <CmdVote
            activateSelection={activateSelection}
            isSelection={isSelection}
            wolfVote={true}
          />
        )}
      {canPerform1 && (
        <CmdPerform
          canPerform={canPerform1}
          activateSelection={activateSelection}
          activateDoubleSelection={activateDoubleSelection}
          noSelectionAction={noSelectionAction}
        />
      )}
      {canPerform2 && (
        <CmdPerform
          canPerform={canPerform2}
          activateSelection={activateSelection}
          activateDoubleSelection={activateDoubleSelection}
          noSelectionAction={noSelectionAction}
        />
      )}
    </>
  );
};

export default PlayingCommands;
