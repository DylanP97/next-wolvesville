"use client"

import Image from "next/image";
import AvatarUI from "../../profile/Profile/AvatarUI";
import tombstone from "../../../public/game/tombstone.png"
import { Button, Card } from "@nextui-org/react";
import { useAuth } from "../../providers/AuthProvider";

const NewPlayersGrid = ({
    isSelection,
    setIsSelection,
    playersList,
    clientPlayer
}) => {
    const { socket } = useAuth();

    const handlePlayerClick = (selectedPlayer) => {
        if (!selectedPlayer.isAlive) {
            console.log("This player is dead. Stop hitting its grave.");
            return;
        }

        if (selectedPlayer.id === clientPlayer.id) {
            console.log("Don't select yourself!");
            return;
        }

        if (selectedPlayer.isUnderArrest) {
            console.log("this player is locked up in jail. You can't get select him.");
            return;
        }

        if (isSelection) {
            if (timeOfTheDay === "votetime") {
                // const isMayor = playerToPlay.role.name === "Mayor";
                // voteForVotetime(selectedPlayer.id, isMayor);
                return;
            } else {
                socket.emit("registerAction", {
                    type: clientPlayer.role.canPerform.type,
                    player: clientPlayer.id,
                    selectedPlayerId: selectedPlayer.id,
                    actionTime: clientPlayer.role.canPerform.actionTime,
                });
                setIsSelection("");
                return;
            }
        }
    };

    return (
        <div className="flex flex-row gap-2 my-4 place-items-center xl:w-[80%]">
            {
                playersList.map((player) => {
                    return (
                        <Card key={player.id}
                            className={`${player.isAlive
                                ? player.id !== clientPlayer.id
                                    ? isSelection
                                    // || isDoubleSelection
                                        ? "bg-slate-800 hover:bg-red-800 cursor-pointer"
                                        : "bg-transparent-50 bg-cyan-900"
                                    : "bg-yellow-950"
                                : "bg-black"
                                } ${clientPlayer.id === player.id && "outline-1 outline outline-white"
                                } w-full md:w-48 h-full md:h-full flex flex-col justify-center items-center relative rounded-xl md:rounded-3xl`}
                            onClick={() => handlePlayerClick(player)}
                        >
                            {!player.isAlive ? (
                                <Image className="" width={60} height={60} src={tombstone} alt="role" />
                            ) : player.isRevealed ? (
                                <Image
                                    width={60}
                                    height={60}
                                    src={player.role.image}
                                    alt="role"
                                />
                            ) : (
                                <AvatarUI heightAndWidth={100} />
                            )}
                            <p className="text-black text-xs mt-2">{player.name}</p>
                        </Card>
                    )
                })
            }
        </div>

    );
}

export default NewPlayersGrid;