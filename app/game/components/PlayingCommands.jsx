"use client"

import voteAgainstIcon from "../../../public/game/vote-time.png";
import { Image } from "@nextui-org/react";

const PlayingCommands = ({ clientPlayer, timeOfTheDay, isSelection, setIsSelection, isBlocked, setIsBlocked, actionType, setActionType }) => {

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

    const handleClick = (action) => {
        if (!isBlocked) {
            setIsSelection(!isSelection)
            setActionType(action)
        } else {
            console.log("you already select something now selection mode is blocked")
        }
    }

    return (
        <>
            {clientPlayer.role.canPerform && !isUnderArrest && !needDoubleSelection && (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
            ((timeOfTheDay === "daytime" && actionTime === "day") || (timeOfTheDay === "nighttime" && actionTime === "night")) &&
            // (name !== "Grave Robber" || (name === "Grave Robber" && deadPlayers.length > 0)) &&
            (
                <div onClick={() => handleClick(type)} className={`${isSelection ? 'bg-slate-900' : 'bg-green-600'} w-[40px] h-[40px] p-[10px] cursor-pointer flex justify-center items-center`}>
                    <Image
                        src={emoji}
                        alt={type}
                        width={40}
                        height={40}
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>
            )}
            {timeOfTheDay === "votetime" && canVote && (
                <div onClick={() => handleClick("vote")} className={`${isSelection ? 'bg-slate-900' : 'bg-red-800'} w-[40px] h-[40px] p-[10px] cursor-pointer flex justify-center items-center`}>
                    <Image
                        src={voteAgainstIcon.src}
                        alt="voteAgainst"
                        width={40}
                        height={40}
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>
            )}
        </>
    )
}

export default PlayingCommands;