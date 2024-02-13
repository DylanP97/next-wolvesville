"use client"

import voteAgainstIcon from "../../../public/game/vote-time.png";
import { Image } from "@nextui-org/react";

const PlayingCommands = ({ clientPlayer, timeOfTheDay, isSelection, setIsSelection }) => {

    const {
        role: { canVote, canPerform, name, bombPower, playersToSetOnFire, partner } = {},
        isUnderArrest,
    } = clientPlayer;

    const {
        label = undefined,
        emoji = undefined,
        needSelection = undefined,
        needDoubleSelection = undefined,
        actionTime = undefined,
        nbrLeftToPerform = undefined,
    } = canPerform || {};


    const handleClick = (actionType) => {
        setIsSelection(actionType);
    }

    return (
        <div className="rounded-xl my-2 flex justify-between w-fit h-12 bg-slate-900">
            {clientPlayer.role.canPerform && !isUnderArrest && !needDoubleSelection && (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
                ((timeOfTheDay === "daytime" && actionTime === "day") || (timeOfTheDay === "nighttime" && actionTime === "night")) &&
                (name !== "Grave Robber" || (name === "Grave Robber" && deadPlayers.length > 0)) && (
                    <div onClick={() => handleClick(label)} className="w-[50px] p-[5px] cursor-pointer hover:bg-slate-500 rounded-xl flex justify-center items-center">
                        <Image
                            src={emoji}
                            alt={label}
                            width={50}
                            height={50}
                            style={{ width: "auto", height: "auto" }}
                        />
                    </div>
                )}
            {timeOfTheDay === "votetime" && name !== "Mayor" && canVote && (
                <div onClick={() => handleClick(label)} className="w-[50px] p-[5px] cursor-pointer hover:bg-slate-500 rounded-xl flex justify-center items-center">
                    <Image
                        src={voteAgainstIcon.src}
                        alt="voteAgainst"
                        width={50}
                        height={50}
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>

            )}
        </div>
    )
}

export default PlayingCommands;