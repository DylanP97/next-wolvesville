"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

const NewGameArea = ({ teams }) => {
    const { game, socket } = useAuth();
    console.log("game : ")
    console.log(game.playersList)
    const [playersList, setPlayersList] = useState(game.playersList);

    useEffect(() => {
        console.log("hello useeffect")
        console.log(game.playersList)
        setPlayersList(game.playersList);
    }, [game]);

    const killPlayer = (name) => {
        socket.emit("playerKill", game.id, name);
    };

    return (
        <div>
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
        </div>
    );
};

export default NewGameArea;