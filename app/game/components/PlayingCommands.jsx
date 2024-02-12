"use client"

import voteAgainstIcon from "../../../public/game/vote-time.png";
import { Command1 } from "./Commands";

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



    return (
        <div className="rounded-xl my-2 flex justify-between w-fit h-12 bg-slate-900">
            {clientPlayer.role.canPerform && !isUnderArrest && !needDoubleSelection && (nbrLeftToPerform === undefined || nbrLeftToPerform > 0) &&
                ((timeOfTheDay === "daytime" && actionTime === "day") || (timeOfTheDay === "nighttime" && actionTime === "night")) &&
                (name !== "Grave Robber" || (name === "Grave Robber" && deadPlayers.length > 0)) && (
                <Command1
                    action={label}
                    image={emoji}
                />
            )}
            {timeOfTheDay === "votetime" && name !== "Mayor" && canVote && (
                <Command1
                    action="voteAgainst"
                    image={voteAgainstIcon.src}
                />
            )}
        </div>
    )
}

export default PlayingCommands;