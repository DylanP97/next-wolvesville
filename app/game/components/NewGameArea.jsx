"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import Background from "./Background";
import WinnerOverlay from "./WinnerOverlay";
import ActionsHistory from "./ActionsHistory";
import PlayerInfos from "./PlayerInfos";
import GameHeader from "./GameHeader";
import Image from "next/image";
import AvatarUI from "../Profile/AvatarUI";
import tombstone from "../../../public/game/tombstone.png"
import { Button, Card } from "@nextui-org/react";

const NewGameArea = ({ teams }) => {
    const { game, socket, username } = useAuth();
    const actionsHistoryListRef = useRef(null);
    const clientPlayer = game.playersList.find((p) => p.name == username)
    const [playersList, setPlayersList] = useState(game.playersList);
    // const [aliveList, setAliveList] = useState(game.aliveList);

    useEffect(() => {
        setPlayersList(game.playersList);
        // setAliveList(game.aliveList);
        socket.emit("checkForWinner", game.id);
    }, [game]);

    const killPlayer = (name) => {
        socket.emit("playerKill", game.id, name);
    };

    const revealPlayer = (name) => {
        socket.emit("playerReveal", game.id, name);
    };

    const displayAction = (message, itsANewDay) => {
        const newAction = document.createElement("li");
        newAction.classList.add("text-xs");
        newAction.innerText = message;
        if (itsANewDay) {
            const divider = document.createElement("hr");
            actionsHistoryListRef.current.prepend(divider);
        }
        actionsHistoryListRef.current.prepend(newAction);
    };

    return (
        <section
            className={`${game.timeOfTheDay === "daytime" ? "bg-sky-500" : game.timeOfTheDay === "votetime" ? "bg-sky-700" : "bg-black"
                } h-screen w-screen p-4 absolute top-0`}
            style={{ outline: "none" }}>
            <GameHeader timeOfTheDay={game.timeOfTheDay} dayCount={game.dayCount} timeCounter={game.timeCounter} />
            <Background timeOfTheDay={game.timeOfTheDay} />
            <ActionsHistory actionsHistoryListRef={actionsHistoryListRef} />
            <PlayerInfos clientPlayer={clientPlayer} />
            <div className="grid grid-cols-4 gap-2 my-2 place-items-center xl:w-[80%]">
                {
                    playersList.map((player) => {
                        return (
                            <Card key={player.id} className="p-3 w-full flex flex-col ">
                                {!player.isAlive ? (
                                    <Image className="absolute" width={60} height={60} src={tombstone} alt="role" />
                                ) : player.isRevealed ? (
                                    <Image
                                        width={60}
                                        height={60}
                                        src={player.role.image}
                                        alt="role"
                                    />
                                ) : (
                                    <AvatarUI />
                                )}
                                <p className="text-black">{player.name}</p>
                                <p className="text-black">{player.role.name}</p>
                                <Button className="m-2" variant="ghost" color="secondary" onClick={() => killPlayer(player.name)}>Kill me</Button>
                                <Button className="m-2" variant="ghost" color="secondary" onClick={() => revealPlayer(player.name)}>Reveal me</Button>
                            </Card>
                        )
                    })
                }
            </div>
            {game.winningTeam && <WinnerOverlay winningTeam={game.winningTeam} />}
        </section>
    );
};

export default NewGameArea;