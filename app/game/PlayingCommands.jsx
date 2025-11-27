"use client";

import CmdVote from "./CmdVote";
import CmdPerform from "./CmdPerform";
import { useGame } from "./GameProvider";
import { useAuth } from "../providers/AuthProvider";
import { useAnimation } from "../providers/AnimationProvider";
import { useTranslation } from "react-i18next";

const PlayingCommands = () => {
  const { socket } = useAuth();
  const { triggerSimpleMessage } = useAnimation();
  const { t } = useTranslation();

  const {
    clientPlayer,
    timeOfTheDay,
    selectionState,
    selectionHelpers,
    gameId,
  } = useGame();

  const { role: { canVote, canPerform1, canPerform2 } = {} } = clientPlayer;

  // Access actionType from selectionState:
  const actionType = selectionState.actionType;

  // Check if vote is blocked:
  const isVoteBlocked = selectionHelpers.isActionBlocked('wolfVote') ||
    selectionHelpers.isActionBlocked('vote');

  const activateSelection = (newActionType, emoji, needsDouble = false) => {
    if (selectionHelpers.isActionBlocked(newActionType)) {
      triggerSimpleMessage(t("errorMessage.0012"));
      return;
    }
    selectionHelpers.toggle(newActionType, emoji, needsDouble);
  };

  const noSelectionAction = (actionType) => {
    if (clientPlayer.role.name === "Mayor" && actionType === "assertDuty") {
      socket.emit("assertDuty", clientPlayer.name, gameId);
    }
    if (clientPlayer.role.name === "Pyromaniac" && actionType === "burn") {
      if (clientPlayer.nbrOfPouredPlayers > 0) {
        socket.emit("burnThemDown", {
          type: "burn",
          pyroId: clientPlayer.id,
        }, gameId);
      } else {
        triggerSimpleMessage(t("errorMessage.0013"));
      }
    }
  };

  const activateDoubleSelection = (newActionType, emoji) => {
    activateSelection(newActionType, emoji, true);
  };

  // console.log(clientPlayer)

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
