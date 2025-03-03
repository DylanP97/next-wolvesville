"use client";

import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import { useGame } from "./GameProvider";
import { divActionIcon, imgActionIcon } from "../lib/styles";

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
    isSelection,
    isDoubleSelection,
    isBlocked,
    isJailer,
    hasHandcuffed
  } = useGame();

  const {
    label = undefined,
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
    return (
      <Tooltip content={label} color="secondary" variant="flat">
        <div
          onClick={() => {
            if (needSelection) activateSelection(type);
            else if (needDoubleSelection) activateDoubleSelection(type);
            else noSelectionAction(type);
          }}
          className={`${
            isBlocked
              ? "bg-slate-500"
              : isSelection || isDoubleSelection
              ? "bg-red-600 hover:bg-red-500"
              : "bg-green-600 hover:bg-green-500"
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
