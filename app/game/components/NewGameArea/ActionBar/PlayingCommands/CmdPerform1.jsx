"use client"

import Image from "next/image"
import { Tooltip } from "@nextui-org/react";

const CmdPerform1 = ({
    canPerform,
    rolename,
    isUnderArrest,
    isSelection,
    activateSelection,
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

    return (
        <>
            {
                needSelection && canPerform && !isUnderArrest && !needDoubleSelection && (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
                ((timeOfTheDay === "daytime" && actionTime === "day") || (timeOfTheDay === "nighttime" && actionTime === "night")) &&
                // (name !== "Grave Robber" || (name === "Grave Robber" && deadPlayers.length > 0)) &&
                <Tooltip content={label} color="secondary" variant="flat">
                    <div
                        onClick={() => activateSelection(type)}
                        className={`${isSelection ? 'bg-slate-900' : 'bg-green-600 hover:bg-green-400'} w-[60px] h-[60px] p-2 cursor-pointer flex justify-center items-center z-20 relative`}
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
            }
        </>

    )
}

export default CmdPerform1