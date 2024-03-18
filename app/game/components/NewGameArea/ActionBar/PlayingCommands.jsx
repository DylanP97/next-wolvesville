"use client"

import CmdVote from "./PlayingCommands/CmdVote";
import CmdPerform1 from "./PlayingCommands/CmdPerform1";
import CmdPerform2 from "./PlayingCommands/CmdPerform2";

const PlayingCommands = ({ clientPlayer, dayCount, timeOfTheDay, isSelection, setIsSelection, isDoubleSelection, setIsDoubleSelection, isBlocked, setIsBlocked, actionType, setActionType }) => {

    const {
        role: {
            canVote,
            canPerform,
            canPerform2,
            name,
            bombPower,
            playersToSetOnFire,
            partner
        } = {},
        isUnderArrest,
        hasHandcuffed
    } = clientPlayer;

    const activateSelection = (action) => {
        if (!isBlocked) {
            setIsSelection(!isSelection)
            setActionType(action)
        } else {
            console.log("you already select something now selection mode is blocked")
        }
    }

    const activateDoubleSelection = (action) => {
        if (!isBlocked) {
            setIsDoubleSelection(!isDoubleSelection)
            setActionType(action)
        } else {
            console.log("you already select something now doubleSelection mode is blocked")
        }
    }

    return (
        <div className="w-[180px] z-20">
            {
                timeOfTheDay === "votetime" && canVote && <CmdVote activateSelection={activateSelection} isSelection={isSelection} />
            }
            {
                canPerform && <CmdPerform1 canPerform={canPerform} dayCount={dayCount} timeOfTheDay={timeOfTheDay} activateSelection={activateSelection} activateDoubleSelection={activateDoubleSelection} isSelection={isSelection} isDoubleSelection={isDoubleSelection} isUnderArrest={isUnderArrest} rolename={name} />
            }
            {
                canPerform2 && <CmdPerform2 canPerform2={canPerform2} timeOfTheDay={timeOfTheDay} activateSelection={activateSelection} isSelection={isSelection} isUnderArrest={isUnderArrest} rolename={name} hasHandcuffed={hasHandcuffed} />
            }
        </div>
    )
}

export default PlayingCommands;