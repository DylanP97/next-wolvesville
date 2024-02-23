"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import Background from "./Background";
import WinnerOverlay from "./WinnerOverlay";
import ActionsHistory from "./ActionsHistory";
import PlayerInfos from "./PlayerInfos";
import GameHeader from "./GameHeader";
import PlayingCommands from "./PlayingCommands";
import NewPlayersGrid from "./NewPlayersGrid";
import Chatbox from "./Chatbox";
import WolvesActionsHistory from "./WolvesActionsHistory";

const NewGameArea = ({ }) => {
    const { game, socket, username } = useAuth();
    const clientPlayer = game.playersList.find((p) => p.name == username);
    const [playersList, setPlayersList] = useState(game.playersList);
    const [messagesHistory, setMessagesHistory] = useState(game.messagesHistory);
    const [wolvesMessagesHistory, setWolvesMessagesHistory] = useState(game.wolvesMessagesHistory);
    const [isSelection, setIsSelection] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [actionType, setActionType] = useState("");

    useEffect(() => {
        setPlayersList(game.playersList);
        setMessagesHistory(game.messagesHistory);
        setWolvesMessagesHistory(game.wolvesMessagesHistory);
        socket.emit("checkForWinner", game.id);
    }, [game]);

    useEffect(() => {
        setIsSelection(false);
        setIsBlocked(false);
        setActionType("");
    }, [game.timeOfTheDay])

    return (
        <section
            className={`${game.timeOfTheDay === "daytime" ? "bg-sky-500" : game.timeOfTheDay === "votetime" ? "bg-sky-700" : "bg-black"
                } h-screen w-screen p-4 absolute top-0 left-0 relative`}
            style={{ outline: "none" }}>
            <GameHeader timeOfTheDay={game.timeOfTheDay} dayCount={game.dayCount} timeCounter={game.timeCounter} />
            <Background timeOfTheDay={game.timeOfTheDay} />
            <PlayerInfos clientPlayer={clientPlayer} />
            <NewPlayersGrid gameId={game.id} timeOfTheDay={game.timeOfTheDay} isSelection={isSelection} setIsSelection={setIsSelection} isBlocked={isBlocked} setIsBlocked={setIsBlocked} playersList={playersList} clientPlayer={clientPlayer} actionType={actionType} setActionType={setActionType} />
            <div className="flex flex-row gap-2">
                <ActionsHistory key="all" messagesHistory={messagesHistory} />
                {
                    game.timeOfTheDay == "nighttime" && clientPlayer.role.team.join() == "werewolves" && <WolvesActionsHistory key="wolves" messagesHistory={wolvesMessagesHistory} />
                }
            </div>
            <Chatbox timeOfTheDay={game.timeOfTheDay} gameId={game.id} clientPlayer={clientPlayer} />
            <PlayingCommands clientPlayer={clientPlayer} timeOfTheDay={game.timeOfTheDay} isSelection={isSelection} setIsSelection={setIsSelection} isBlocked={isBlocked} setIsBlocked={setIsBlocked} actionType={actionType} setActionType={setActionType} />
            {game.winningTeam && <WinnerOverlay winningTeam={game.winningTeam} />}
            {
                isBlocked && <p className="text-white mt-2">You made your selection.</p>
            }
        </section>
    );
};

export default NewGameArea;