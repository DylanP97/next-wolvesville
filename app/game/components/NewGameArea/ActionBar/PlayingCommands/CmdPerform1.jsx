"use client"

import Image from "next/image"
import { Tooltip } from "@nextui-org/react";

const CmdPerform1 = ({
    canPerform,
    dayCount,
    rolename,
    isUnderArrest,
    isSelection,
    isDoubleSelection,
    activateSelection,
    activateDoubleSelection,
    timeOfTheDay,
}) => {

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
            (timeOfTheDay === "nighttime" && dayCount === 0 && actionTime === "1stnight"))
    ) {

        return (
            <Tooltip content={label} color="secondary" variant="flat">
                <div
                    onClick={() => {
                        if (needSelection) activateSelection(type)
                        else if (needDoubleSelection) activateDoubleSelection(type)
                    }}
                    className={
                        `${(isSelection || isDoubleSelection) ? 'bg-slate-900' : 'bg-green-600 hover:bg-green-400'} w-[60px] h-[60px] p-2 cursor-pointer flex justify-center items-center z-20 relative`
                    }
                >
                    <Image
                        src={emoji}
                        alt={type}
                        width={50}
                        height={50}
                        className="max-h-[40px] max-w-[40px] object-contain	"
                    />
                    <p className="absolute bottom-0 right-0 text-white">{nbrLeftToPerform !== undefined && nbrLeftToPerform}</p>
                </div>
            </Tooltip>
        )
    }
}

export default CmdPerform1