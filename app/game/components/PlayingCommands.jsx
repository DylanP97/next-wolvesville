"use client"

import voteAgainstIcon from "../../../public/game/vote-time.png";
import { Image } from "@nextui-org/react";
import CommandPerform2 from "./CommandPerform2";

const PlayingCommands = ({ clientPlayer, timeOfTheDay, isSelection, setIsSelection, isBlocked, setIsBlocked, actionType, setActionType }) => {

    const {
        role: { canVote, canPerform, canPerform2, name, bombPower, playersToSetOnFire, partner } = {},
        isUnderArrest, hasHandcuffed
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
            {
                clientPlayer.role.canPerform && !isUnderArrest && !needDoubleSelection && (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
                ((timeOfTheDay === "daytime" && actionTime === "day") || (timeOfTheDay === "nighttime" && actionTime === "night")) &&
                // (name !== "Grave Robber" || (name === "Grave Robber" && deadPlayers.length > 0)) &&
                (
                    <div onClick={() => handleClick(type)} className={`${isSelection ? 'bg-slate-900' : 'bg-green-600'} w-[60px] h-[60px] p-1 cursor-pointer flex justify-center items-center`}>
                        <Image
                            src={emoji}
                            alt={type}
                            width={50}
                            height={50}
                            className=""
                        />
                    </div>
                )
            }

            {
                timeOfTheDay === "votetime" && canVote && (
                    <div onClick={() => handleClick("vote")} className={`${isSelection ? 'bg-slate-900' : 'bg-red-800'} w-[60px] h-[60px] p-1 cursor-pointer flex justify-center items-center`}>
                        <Image
                            src={voteAgainstIcon.src}
                            alt="voteAgainst"
                            width={50}
                            height={50}
                            className=""
                        />
                    </div>
                )
            }

            {
                canPerform2 && (
                    <CommandPerform2 canPerform2={canPerform2} timeOfTheDay={timeOfTheDay} handleClickFn={handleClick} isSelection={isSelection} isUnderArrest={isUnderArrest} rolename={name} hasHandcuffed={hasHandcuffed} />
                )
            }
        </>
    )
}

export default PlayingCommands;