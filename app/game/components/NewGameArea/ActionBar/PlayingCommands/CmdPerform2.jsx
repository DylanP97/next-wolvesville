"use client"

import Image from "next/image";
import { Tooltip } from "@nextui-org/react";

const CommandPerform2 = ({
    canPerform2,
    rolename,
    isUnderArrest,
    hasHandcuffed,
    activateSelection,
    isSelection,
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
    } = canPerform2 || {};

    return (
        <>
            {
                needSelection && canPerform2 && !isUnderArrest && !needDoubleSelection && (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
                ((timeOfTheDay === "daytime" && actionTime === "day") || (timeOfTheDay === "nighttime" && actionTime === "night")) && (rolename == "Jailer" && hasHandcuffed) &&
                (
                    <Tooltip content={label} color="secondary" variant="flat">
                        <div onClick={() => activateSelection(type)} className={`${isSelection ? 'bg-slate-900' : 'bg-green-600 hover:bg-green-400'} w-[60px] h-[60px] p-2 cursor-pointer flex justify-center items-center z-20`}>
                            <Image
                                src={emoji}
                                alt={type}
                                width={50}
                                height={50}
                                className="max-h-[40px] max-w-[40px] object-contain	"
                            />
                        </div>
                    </Tooltip>
                )
            }
        </>
    )
}


export default CommandPerform2 