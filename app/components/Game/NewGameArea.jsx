"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import Background from "./Background";
import WinnerOverlay from "./WinnerOverlay";

const NewGameArea = ({ teams }) => {
    const { game, socket } = useAuth();
    const [playersList, setPlayersList] = useState(game.playersList);

    useEffect(() => {
        setPlayersList(game.playersList);
        socket.emit("checkForWinner", game.id);
    }, [game]);

    const killPlayer = (name) => {
        socket.emit("playerKill", game.id, name);
    };

    return (
        <section
            className={`${game.timeOfTheDay === "daytime" ? "bg-sky-500" : game.timeOfTheDay === "votetime" ? "bg-sky-700" : "bg-black"
                } h-screen w-screen p-4 relative`}
            style={{ outline: "none" }}>
            <Background timeOfTheDay={game.timeOfTheDay} />
            <p className="text-white">{game.timeOfTheDay}</p>
            <p className="text-white">{game.dayCount}</p>
            {
                playersList.map((player) => {
                    return (
                        <div key={player.id}>
                            <p className="text-white">{player.name}</p>
                            <p className="text-white">{player.role.name}</p>
                            {
                                player.isAlive ? <p>vivant </p> : <p>mort </p>
                            }
                            <button onClick={() => killPlayer(player.name)}>Kill me</button>
                        </div>
                    )
                })
            }
            {game.winningTeam && <WinnerOverlay winningTeam={game.winningTeam} />}
        </section>
    );
};

export default NewGameArea;