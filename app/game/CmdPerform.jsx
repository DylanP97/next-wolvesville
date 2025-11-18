"use client";

import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import { useGame } from "./GameProvider";
import { divActionIcon, imgActionIcon } from "../lib/styles";
import i18n from "../lib/i18n";

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
    selectionState,     // <-- ADD
    selectionHelpers,   // <-- ADD (for future use)
    isJailer,
    hasHandcuffed,
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

  if (
    canPerform &&
    !isUnderArrest &&
    (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
    ((timeOfTheDay === "daytime" && actionTime === "day") ||
      (timeOfTheDay === "nighttime" && actionTime === "night") ||
      (timeOfTheDay === "nighttime" &&
        dayCount === 0 &&
        actionTime === "1stnight")) &&
    (isJailer && type === "execute" ? Boolean(hasHandcuffed) : true)
  ) {

    const actionType = selectionState.actionType; // <-- GET FROM STATE

    return (
      <Tooltip content={i18n.language === "fr" ? labelFR : label} color="secondary" variant="flat">
        <div
          onClick={() => {
            if (needSelection) activateSelection(type);
            else if (needDoubleSelection) activateDoubleSelection(type);
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
            width={50}
            height={50}
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
