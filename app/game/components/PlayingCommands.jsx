"use client"

import { Image } from "@nextui-org/react";
import voteAgainstIcon from "../../../public/game/vote-time.png";

const PlayingCommands = ({ clientPlayer, timeOfTheDay }) => {

    const {
        role: { canVote, canPerform, name, bombPower, playersToSetOnFire, partner } = {},
        isUnderArrest,
    } = clientPlayer;
    
    // Check if canPerform is defined before further destructuring
    const {
        label = undefined,
        emoji = undefined,
        needSelection = undefined,
        needDoubleSelection = undefined,
        actionTime = undefined,
        nbrLeftToPerform = undefined,
    } = canPerform || {};
    
    console.log(canVote)
    console.log(timeOfTheDay)

    return (
        <div className="bg-slate-900 text-white rounded-xl shadow-lg p-4 my-2 flex justify-between">
            <div className="bg-white text-black">
                Type to chat
            </div>
            <div>
                Command 1
            </div>
            <div>
                {
                    clientPlayer.role.canPerform && (
                        <>
                            {!isUnderArrest &&
                                !needDoubleSelection &&
                                (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
                                ((timeOfTheDay === "daytime" && actionTime === "day") ||
                                    (timeOfTheDay === "nighttime" && actionTime === "night")) &&
                                (name !== "Grave Robber" || (name === "Grave Robber" && deadPlayers.length > 0)) && (
                                    <Image
                                        src={emoji}
                                        alt="action-emoji"
                                        width={40}
                                        height={40}
                                        priority
                                        style={{ width: "auto", height: "auto" }}
                                    />
                                )}
                        </>
                    )
                }
            </div>
            <div>
                {timeOfTheDay === "votetime" && name !== "Mayor" && canVote && (
                    <Image
                        src={voteAgainstIcon.src}
                        alt="vote-action"
                        width={40}
                        height={40}
                        priority
                        style={{ width: "auto", height: "auto" }}
                    />
                )}
            </div>
        </div>
    )
}

export default PlayingCommands;