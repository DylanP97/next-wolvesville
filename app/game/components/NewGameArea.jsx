"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import Background from "./NewGameArea/Background";
import WinnerOverlay from "./NewGameArea/WinnerOverlay";
import ActionsHistory from "./NewGameArea/ActionsHistory";
import ActionBar from "./NewGameArea/ActionBar";
import PlayerInfos from "./NewGameArea/PlayerInfos";
import GameHeader from "./NewGameArea/GameHeader";
import NewPlayersGrid from "./NewGameArea/NewPlayersGrid";

const NewGameArea = () => {
    const { game, socket, username } = useAuth();
    const [clientPlayer, setClientPlayer] = useState(game.playersList.find((p) => p.name == username))
    const [isSelection, setIsSelection] = useState(false);
    const [isDoubleSelection, setIsDoubleSelection] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [actionType, setActionType] = useState("");

    const sharedProps = {
        clientPlayer,
        isSelection,
        setIsSelection,
        isDoubleSelection,
        setIsDoubleSelection,
        isBlocked,
        setIsBlocked,
        actionType,
        setActionType
    }

    useEffect(() => {
        if (!game.winningTeam) {
            setClientPlayer(game.playersList.find((p) => p.name == username))
            socket.emit("checkForWinner", game.id);
        }
    }, [game]);

    useEffect(() => {
        setIsSelection(false);
        setIsDoubleSelection(false);
        setIsBlocked(false);
        setActionType("");
    }, [game.timeOfTheDay])

    return (
        <section
            className={`${game.timeOfTheDay === "daytime" ? "bg-sky-500" : game.timeOfTheDay === "votetime" ? "bg-sky-700" : "bg-black"} h-screen w-screen absolute top-0 left-0 relative outline-none`}
        >

            <GameHeader timeOfTheDay={game.timeOfTheDay} dayCount={game.dayCount} timeCounter={game.timeCounter} />

            <Background timeOfTheDay={game.timeOfTheDay} clientPlayer={clientPlayer} />

            <PlayerInfos clientPlayer={clientPlayer} />

            <NewPlayersGrid
                playersList={game.playersList}
                timeOfTheDay={game.timeOfTheDay}
                gameId={game.id}
                {...sharedProps}
            />

            {
                clientPlayer.isUnderArrest || (clientPlayer.role.name === "Jailer" && game.timeOfTheDay == "nighttime" && clientPlayer.hasHandcuffed) ? (
                    <ActionsHistory key="jail" type="Jail" messagesHistory={game.jailNightMessages} />
                ) : (
                    game.timeOfTheDay == "nighttime" && clientPlayer.role.team.join() == "werewolves" ?
                        (
                            <ActionsHistory key="wolves" type="Wolves" messagesHistory={game.wolvesMessagesHistory} />
                        ) : (
                            <ActionsHistory key="village" type="Village" messagesHistory={game.messagesHistory} />
                        )
                )
            }

            <ActionBar
                dayCount={game.dayCount}
                timeOfTheDay={game.timeOfTheDay}
                gameId={game.id}
                {...sharedProps}
            />
            {
                isDoubleSelection && <p className="text-white text-xs mt-2">isDoubleSelection active</p>
            }
            {
                isSelection && <p className="text-white text-xs mt-2">isSelection active</p>
            }
            {
                isBlocked && <p className="text-white text-xs mt-2">You made your selection.</p>
            }

            {
                game.winningTeam && <WinnerOverlay winningTeam={game.winningTeam} />
            }

        </section>
    );
};

export default NewGameArea;