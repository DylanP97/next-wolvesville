"use client"

import Image from "next/image";
import { Tooltip } from "@nextui-org/react";

const CommandPerform2 = ({
    canPerform2,
    timeOfTheDay,
    handleClickFn,
    isSelection,
    isUnderArrest,
    rolename,
    hasHandcuffed
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
                canPerform2 && !isUnderArrest && !needDoubleSelection && (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
                ((timeOfTheDay === "daytime" && actionTime === "day") || (timeOfTheDay === "nighttime" && actionTime === "night")) && (rolename == "Jailer" && hasHandcuffed) &&
                (
                    <Tooltip content={label}>
                        <div onClick={() => handleClickFn(type)} className={`${isSelection ? 'bg-slate-900' : 'bg-green-600'} w-[60px] h-[60px] p-1 cursor-pointer flex justify-center items-center`}>
                            <Image
                                src={emoji}
                                alt={type}
                                width={50}
                                height={50}
                                className=""
                            />
                        </div>
                    </Tooltip>
                )
            }
        </>
    )
}


export default CommandPerform2 