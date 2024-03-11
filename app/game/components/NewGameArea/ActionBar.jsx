"use client"

import Chatbox from "./ActionBar/Chatbox";
import PlayingCommands from "./ActionBar/PlayingCommands";

const ActionBar = ({
    timeOfTheDay,
    gameId,
    clientPlayer,
    isSelection,
    setIsSelection,
    isBlocked,
    setIsBlocked,
    actionType,
    setActionType
}) => {

    return (
        <div className="flex flex-row w-full border b-2 border-red-500">
            <Chatbox
                timeOfTheDay={timeOfTheDay}
                gameId={gameId}
                clientPlayer={clientPlayer}
            />
            <PlayingCommands
                clientPlayer={clientPlayer}
                timeOfTheDay={timeOfTheDay}
                isSelection={isSelection}
                setIsSelection={setIsSelection}
                isBlocked={isBlocked}
                setIsBlocked={setIsBlocked}
                actionType={actionType}
                setActionType={setActionType}
            />
        </div>
    )
};

export default ActionBar;