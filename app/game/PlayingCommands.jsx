"use client";

import CmdVote from "./CmdVote";
import CmdPerform from "./CmdPerform";
import { useGame } from "./GameProvider";
import { useAuth } from "../providers/AuthProvider";
import { useAnimation } from "../providers/AnimationProvider";

const PlayingCommands = () => {
  const { socket } = useAuth();
  const { triggerSimpleMessage } = useAnimation();

  const {
    clientPlayer,
    timeOfTheDay,
    selectionState,      // <-- ADD
    selectionHelpers,    // <-- ADD
    gameId,
  } = useGame();

  const { role: { canVote, canPerform1, canPerform2 } = {} } = clientPlayer;

  // const activateSelection = (newActionType) => {
  //   if (!isBlocked) {
  //     if (isSelection && actionType === newActionType) {
  //       setIsSelection(false);
  //       setActionType("");
  //     } else {
  //       // Switch to new action
  //       setActionType(newActionType);
  //       setIsSelection(true);
  //       setIsDoubleSelection(false);
  //     }
  //   } else {
  //     triggerSimpleMessage(
  //       "you already select something, now selection mode is blocked"
  //     );
  //   }
  // };

  // const activateDoubleSelection = (newActionType) => {
  //   if (!isBlocked) {
  //     if (isSelection && actionType === newActionType) {
  //       setIsDoubleSelection(false);
  //       setActionType("");
  //     } else {
  //       // Switch to new action
  //       setActionType(newActionType);
  //       setIsDoubleSelection(true);
  //       setIsSelection(false);
  //     }
  //   } else {
  //     triggerSimpleMessage(
  //       "you already select something, now doubleSelection mode is blocked"
  //     );
  //   }
  // };

  // const noSelectionAction = (actionType) => {
  //   if (clientPlayer.role.name === "Mayor" && actionType === "assertDuty") {
  //     socket.emit("assertDuty", clientPlayer.name, gameId);
  //   }
  // };



  // Access actionType from selectionState:
  const actionType = selectionState.actionType;

  // Check if vote is blocked:
  const isVoteBlocked = selectionHelpers.isActionBlocked('wolfVote') ||
    selectionHelpers.isActionBlocked('vote');

  const activateSelection = (newActionType, needsDouble = false) => {
    if (selectionHelpers.isActionBlocked(newActionType)) {
      triggerSimpleMessage("This action has already been used");
      return;
    }
    selectionHelpers.toggle(newActionType, needsDouble);
  };

  // ADD THESE BACK:
  const noSelectionAction = (actionType) => {
    if (clientPlayer.role.name === "Mayor" && actionType === "assertDuty") {
      socket.emit("assertDuty", clientPlayer.name, gameId);
    }
  };

  const activateDoubleSelection = (newActionType) => {
    activateSelection(newActionType, true); // Just call activateSelection with needsDouble=true
  };

  return (
    <>
      {timeOfTheDay === "votetime" && canVote && !isVoteBlocked && (
        <CmdVote
          activateSelection={activateSelection}
          wolfVote={false}
          actionType={actionType}
        />
      )}
      {timeOfTheDay === "nighttime" &&
        clientPlayer.role.team === "Werewolves" && !isVoteBlocked && (
          <CmdVote
            activateSelection={activateSelection}
            wolfVote={true}
            actionType={actionType}
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
