"use client";

import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import { useGame } from "../../../providers/GameProvider";

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
              } h-[80px] aspect-square p-2 cursor-pointer flex justify-center items-center z-20`}
            >
              <Image
                src={emoji}
                alt={type}
                width={50}
                height={50}
                className="max-h-[40px] max-w-[40px] object-contain	"
              />
            </div>
          </Tooltip>
        )}
    </>
  );
};

export default CommandPerform2;
