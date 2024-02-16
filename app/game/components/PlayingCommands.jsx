"use client"

import voteAgainstIcon from "../../../public/game/vote-time.png";
import { Image } from "@nextui-org/react";

const PlayingCommands = ({ clientPlayer, timeOfTheDay, isSelection, setIsSelection, isBlocked, setIsBlocked }) => {

    const {
        role: { canVote, canPerform, name, bombPower, playersToSetOnFire, partner } = {},
        isUnderArrest,
    } = clientPlayer;

    const {
        label = undefined,
        emoji = undefined,
        type = undefined,
        needSelection = undefined,
        needDoubleSelection = undefined,
        actionTime = undefined,
        nbrLeftToPerform = undefined,
    } = canPerform || {};


    const handleClick = () => {
        if (!isBlocked) {
            setIsSelection(!isSelection)
        } else {
            console.log("you already select something now selection mode is blocked")
        }
    }

    return (
        <div className="rounded-xl my-2 flex justify-between w-fit h-12 bg-slate-900">
            {clientPlayer.role.canPerform && !isUnderArrest && !needDoubleSelection && (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
                ((timeOfTheDay === "daytime" && actionTime === "day") || (timeOfTheDay === "nighttime" && actionTime === "night")) &&
                // (name !== "Grave Robber" || (name === "Grave Robber" && deadPlayers.length > 0)) &&
                (
                    <div onClick={() => handleClick()} className={`${isSelection ? 'bg-slate-900' : 'bg-green-600'} w-[50px] p-[5px] cursor-pointer rounded-xl flex justify-center items-center`}>
                        <Image
                            src={emoji}
                            alt={type}
                            width={50}
                            height={50}
                            style={{ width: "auto", height: "auto" }}
                        />
                    </div>
                )}
            {timeOfTheDay === "votetime" && name !== "Mayor" && canVote && (
                <div onClick={() => handleClick(label)} className={`${isSelection ? 'bg-slate-900' : 'bg-red-600'} w-[50px] p-[5px] cursor-pointer rounded-xl flex justify-center items-center`}>
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