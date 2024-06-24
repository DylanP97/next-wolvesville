"use client";

import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import { useGame } from "../../../providers/GameProvider";
import { divActionIcon, imgActionIcon } from "../../../../lib/styles";

const CommandPerform2 = ({ canPerform2, rolename, activateSelection }) => {
  const { timeOfTheDay, isUnderArrest, isSelection, hasHandcuffed } = useGame();

  const {
    label = undefined,
    emoji = undefined,
    type = undefined,
    needSelection = undefined,
    needDoubleSelection = undefined,
    actionTime = undefined,
    nbrLeftToPerform = undefined,
  } = canPerform2 || {};

  return (
    <>
      {needSelection &&
        canPerform2 &&
        !isUnderArrest &&
        !needDoubleSelection &&
        (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
        ((timeOfTheDay === "daytime" && actionTime === "day") ||
          (timeOfTheDay === "nighttime" && actionTime === "night")) &&
        rolename == "Jailer" &&
        hasHandcuffed && (
          <Tooltip content={label} color="secondary" variant="flat">
            <div
              onClick={() => activateSelection(type)}
              className={`${
                isSelection ? "bg-secondary" : "bg-green-600 hover:bg-green-400"
              } ${divActionIcon}`}
            >
              <Image
                src={emoji}
                alt={type}
                width={50}
                height={50}
                style={{ height: "auto", width: "auto" }}
                className={`${imgActionIcon}`}
              />
            </div>
          </Tooltip>
        )}
    </>
  );
};

export default CommandPerform2;
