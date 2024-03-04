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
import PrisonBars from "./PrisonBars";

const NewGameArea = ({ }) => {
    const { game, socket, username } = useAuth();
    const [clientPlayer, setClientPlayer] = useState(game.playersList.find((p) => p.name == username))
    const [playersList, setPlayersList] = useState(game.playersList);
    const [messagesHistory, setMessagesHistory] = useState(game.messagesHistory);
    const [wolvesMessagesHistory, setWolvesMessagesHistory] = useState(game.wolvesMessagesHistory);
    const [jailNightMessages, setJailNightMessages] = useState(game.jailNightMessages);
    const [isSelection, setIsSelection] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [actionType, setActionType] = useState("");

    useEffect(() => {
        if (game.winningTeam !== null) {
            setPlayersList(game.playersList);
            setClientPlayer(game.playersList.find((p) => p.name == username))
            setMessagesHistory(game.messagesHistory);
            setWolvesMessagesHistory(game.wolvesMessagesHistory);
            setJailNightMessages(game.jailNightMessages);
            socket.emit("checkForWinner", game.id);
        }
    }, [game]);

    useEffect(() => {
        setIsSelection(false);
        setIsBlocked(false);
        setActionType("");
    }, [game.timeOfTheDay])

    return (
        <section
            className={`${game.timeOfTheDay === "daytime" ? "bg-sky-500" : game.timeOfTheDay === "votetime" ? "bg-sky-700" : "bg-black"
                } h-screen w-screen absolute top-0 left-0 relative`}
            style={{ outline: "none" }}>
            <GameHeader timeOfTheDay={game.timeOfTheDay} dayCount={game.dayCount} timeCounter={game.timeCounter} />
            <Background timeOfTheDay={game.timeOfTheDay} />
            {
                clientPlayer.isUnderArrest && <PrisonBars />
            }
            <PlayerInfos clientPlayer={clientPlayer} />
            <NewPlayersGrid gameId={game.id} timeOfTheDay={game.timeOfTheDay} isSelection={isSelection} setIsSelection={setIsSelection} isBlocked={isBlocked} setIsBlocked={setIsBlocked} playersList={playersList} clientPlayer={clientPlayer} actionType={actionType} setActionType={setActionType} />
            {
                clientPlayer.isUnderArrest || (clientPlayer.role.name === "Jailer" && game.timeOfTheDay == "nighttime" && clientPlayer.hasHandcuffed) ? (
                    <ActionsHistory key="jailChat" type="jailChat" messagesHistory={jailNightMessages} />
                ) : (
                    game.timeOfTheDay == "nighttime" && clientPlayer.role.team.join() == "werewolves" ?
                        (
                            <ActionsHistory key="wolves" type="wolves" messagesHistory={wolvesMessagesHistory} />
                        ) : (
                            <ActionsHistory key="all" type="all" messagesHistory={messagesHistory} />
                        )
                )
            }
            <Chatbox timeOfTheDay={game.timeOfTheDay} gameId={game.id} clientPlayer={clientPlayer} />
            <PlayingCommands clientPlayer={clientPlayer} timeOfTheDay={game.timeOfTheDay} isSelection={isSelection} setIsSelection={setIsSelection} isBlocked={isBlocked} setIsBlocked={setIsBlocked} actionType={actionType} setActionType={setActionType} />
            {game.winningTeam && <WinnerOverlay winningTeam={game.winningTeam} />}
            {
                isBlocked && <p className="text-white text-xs mt-2">You made your selection.</p>
            }
        </section>
    );
};

export default NewGameArea;