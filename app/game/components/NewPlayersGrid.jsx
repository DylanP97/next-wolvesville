"use client"

import Image from "next/image";
import AvatarUI from "../../profile/Profile/AvatarUI";
import tombstone from "../../../public/game/tombstone.png"
import prison from "../../../public/game/prison.png"
import { useAuth } from "../../providers/AuthProvider";

const NewPlayersGrid = ({
    gameId,
    timeOfTheDay,
    playersList,
    clientPlayer,
    isSelection,
    setIsSelection,
    isBlocked,
    setIsBlocked,
    actionType,
    setActionType
}) => {
    const { socket } = useAuth();

    const handlePlayerClick = (selectedPlayer) => {
        if (!isBlocked) {
            if (isSelection) {
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

                if (timeOfTheDay == "votetime" && actionType == "vote") {
                    const nbr = clientPlayer.role.name === "Mayor" ? 2 : 1;
                    socket.emit("addVote", selectedPlayer.id, nbr, gameId)
                    setIsBlocked(true);
                    setIsSelection(false);
                    return;
                }

                if (timeOfTheDay == "nighttime" && actionType == "devours") {
                    if (selectedPlayer.role.team.join() !== "werewolves") {
                        const nbr = clientPlayer.role.name === "Alpha Werewolf" ? 2 : 1;
                        socket.emit("addWolfVote", selectedPlayer.id, nbr, gameId)
                        setIsBlocked(true);
                        setIsSelection(false);
                    } else {
                        console.log("You can't select a wolf")
                    }
                    return;
                }

                else {
                    if (actionType == "killPrisoner") {
                        socket.emit("killPrisoner", {
                            type: actionType,
                            killerId: clientPlayer.id,
                            selectedPlayerId: selectedPlayer.id,
                            selectedPlayerName: selectedPlayer.name,
                        }, gameId)
                    }
                    if (actionType == "reveal") {
                        socket.emit("revealPlayer", {
                            type: clientPlayer.role.canPerform.type,
                            seerId: clientPlayer.id,
                            selectedPlayerId: selectedPlayer.id,
                            selectedPlayerName: selectedPlayer.name,
                        }, gameId)
                    } else if (actionType == "heal") {
                        socket.emit("heal", {
                            type: clientPlayer.role.canPerform.type,
                            playerId: clientPlayer.id,
                            selectedPlayerId: selectedPlayer.id,
                            selectedPlayerName: selectedPlayer.name,
                        }, gameId)
                    } else {
                        socket.emit("registerAction", {
                            type: clientPlayer.role.canPerform.type,
                            playerId: clientPlayer.id,
                            selectedPlayerId: selectedPlayer.id,
                            actionTime: clientPlayer.role.canPerform.actionTime,
                        }, gameId);
                    }
                    setIsBlocked(true);
                    setIsSelection(false);
                    return;
                }
            } else {
                console.log("Selection mode isn't active ")
                return;
            }
        } else {
            console.log("selection's blocked ")
        }
    };

    return (
        <div className={`flex flex-row place-items-center p-1 w-full xl:w-[80%]`}>
            {
                playersList.map((player) => {
                    return (
                        <div key={"plycard" + player.id}
                            onClick={() => handlePlayerClick(player)}
                            className={`${player.isAlive
                                ? clientPlayer.id !== player.id
                                    ? isSelection && !isBlocked
                                        ? "bg-red-800 cursor-pointer animate-pulse"
                                        : "bg-slate-800"
                                    : "bg-slate-500"
                                : "bg-black"
                                } outline outline-2 outline-white w-full md:w-40 h-full md:h-full flex flex-col justify-center items-center relative p-2`}
                        >
                            {timeOfTheDay == "votetime" && (
                                <div className="bg-slate-800 absolute top-0 right-0 p-1 h-8 aspect-square flex justify-center items-center outline outline-2 outline-white">
                                    <p className="text-white">{player.voteAgainst}</p>
                                </div>
                            )}
                            {timeOfTheDay == "nighttime" && clientPlayer.role.team.join() == "werewolves" && !clientPlayer.isUnderArrest && (
                                <div className="bg-gray-950 absolute top-0 right-0 p-2 h-8 aspect-square flex justify-center items-center outline outline-2 outline-white">
                                    <p className="text-white">{player.wolfVoteAgainst || 0}</p>
                                </div>
                            )}
                            {!player.isAlive ? (
                                <Image width={60} height={60} src={tombstone} alt="tombstone" />
                            ) : player.isUnderArrest ? (
                                <Image className="max-h-[60px] " width={60} height={60} src={prison} alt="prison" />
                            ) : player.isRevealed ? (
                                <Image
                                    src={player.role.image}
                                    width={60}
                                    height={60}
                                    alt="role"
                                />
                            ) : (
                                <AvatarUI heightAndWidth={60} avatar={player.avatar} />
                            )}
                            <p className={`${isSelection && player.id !== clientPlayer.id ? "text-black" : "text-white"} text-xs mt-2`}>{player.name}</p>
                        </div>
                    )
                })
            }
        </div>

    );
}

export default NewPlayersGrid;