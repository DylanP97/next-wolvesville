"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import Background from "./Background";
import WinnerOverlay from "./WinnerOverlay";
import ActionsHistory from "./ActionsHistory";
import PlayerInfos from "./PlayerInfos";
import GameHeader from "./GameHeader";
import PlayingCommands from "./PlayingCommands";
import NewPlayersGrid from "./NewPlayersGrid";
import Chatbox from "./Chatbox";

const NewGameArea = ({ }) => {
    const { game, socket, username } = useAuth();
    const actionsHistoryListRef = useRef(null);
    const clientPlayer = game.playersList.find((p) => p.name == username);
    const [playersList, setPlayersList] = useState(game.playersList);
    const [messagesHistory, setMessagesHistory] = useState(game.messagesHistory);
    const [isSelection, setIsSelection] = useState("");

    useEffect(() => {
        setPlayersList(game.playersList);
        setMessagesHistory(game.messagesHistory);
        socket.emit("checkForWinner", game.id);
    }, [game]);

    useEffect(() => {
        setIsSelection("")
    }, [game.timeOfTheDay])

    return (
        <section
            className={`${game.timeOfTheDay === "daytime" ? "bg-sky-500" : game.timeOfTheDay === "votetime" ? "bg-sky-700" : "bg-black"
                } h-screen w-screen p-4 absolute top-0 left-0 relative`}
            style={{ outline: "none" }}>
            <GameHeader timeOfTheDay={game.timeOfTheDay} dayCount={game.dayCount} timeCounter={game.timeCounter} />
            <Background timeOfTheDay={game.timeOfTheDay} />
            <div className="flex flex-row gap-2">
                <ActionsHistory messagesHistory={messagesHistory} actionsHistoryListRef={actionsHistoryListRef} />
                <PlayerInfos clientPlayer={clientPlayer} />
            </div>
            <NewPlayersGrid isSelection={isSelection} setIsSelection={setIsSelection} playersList={playersList} clientPlayer={clientPlayer} />
            <Chatbox />
            <PlayingCommands clientPlayer={clientPlayer} timeOfTheDay={game.timeOfTheDay} isSelection={isSelection} setIsSelection={setIsSelection} />
            {game.winningTeam && <WinnerOverlay winningTeam={game.winningTeam} />}
        </section>
    );
};

export default NewGameArea;