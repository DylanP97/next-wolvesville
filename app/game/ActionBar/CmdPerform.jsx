"use client";

import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import { useGame } from "../GameProvider";
import { divActionIcon, imgActionIcon } from "../../lib/styles";
import i18n from "../../lib/i18n";

const CmdPerform = ({
  canPerform,
  activateSelection,
  activateDoubleSelection,
  noSelectionAction,
}) => {
  const {
    dayCount,
    timeOfTheDay,
    isUnderArrest,
    selectionState,
    isJailer,
    hasHandcuffed,
    selectionHelpers,
    clientPlayer,
  } = useGame();

  const {
    label = undefined,
    labelFR = undefined,
    emoji = undefined,
    type = undefined,
    needSelection = undefined,
    needDoubleSelection = undefined,
    actionTime = undefined,
    nbrLeftToPerform = undefined,
  } = canPerform || {};

  // Check if player has nightmares - they can't use night abilities
  const hasNightmares = clientPlayer?.willHaveNightmares && actionTime === "night";
  
  if (
    canPerform &&
    !isUnderArrest &&
    !hasNightmares &&
    (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
    ((timeOfTheDay === "daytime" && actionTime === "day") ||
      (timeOfTheDay === "nighttime" && actionTime === "night") ||
      (timeOfTheDay === "nighttime" &&
        dayCount === 0 &&
        actionTime === "1stnight")) &&
    (isJailer && type === "execute" ? Boolean(hasHandcuffed) : true)
  ) {

    const actionType = selectionState.actionType; // <-- GET FROM STATE
    const actionDone = selectionHelpers.isActionBlocked(actionType)

    if (actionDone) return null;


    return (
      <Tooltip content={i18n.language === "fr" ? labelFR : label} color="secondary" variant="flat">
        <div
          onClick={() => {
            if (needSelection) activateSelection(type, emoji);
            else if (needDoubleSelection) activateDoubleSelection(type, emoji);
            else noSelectionAction(type);
          }}
          className={`${actionType === type
            ? "bg-green-600 hover:bg-green-500"
            : "bg-blue-500 hover:bg-blue-700 animate-pulse"
            } ${divActionIcon} relative`}
        >
          <Image
            src={emoji}
            alt={type}
            width={12}
            height={12}
            style={{ height: "auto", width: "auto" }}
            className={`${imgActionIcon}`}
          />
          <p className="absolute bottom-0 right-0 text-white">
            {nbrLeftToPerform !== undefined && nbrLeftToPerform}
          </p>
        </div>
      </Tooltip>
    );
  }
};

export default CmdPerform;
