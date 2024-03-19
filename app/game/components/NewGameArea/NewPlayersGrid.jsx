"use client"

import { useAuth } from "../../../providers/AuthProvider";
import VoteCount from "./PlayersGrid/VoteCount";
import IconReveal from "./PlayersGrid/IconReveal";
import PlayerAvatar from "./PlayersGrid/PlayerAvatar";
import { useState } from "react";
import Image from "next/image";

const NewPlayersGrid = ({
    playersList,
    timeOfTheDay,
    gameId,
    clientPlayer,
    isSelection,
    setIsSelection,
    isDoubleSelection,
    setIsDoubleSelection,
    isBlocked,
    setIsBlocked,
    actionType,
    setActionType
}) => {

    const [selectedPlayer1, setSelectedPlayer1] = useState(null);

    const { socket } = useAuth();
    const clientIsWolf = clientPlayer.role.team.join() == "werewolves"
    const isJailer = clientPlayer.role.name === "Jailer"



    const handlePlayerClick = (selectedPlayer) => {

        function selectionCompleted() {
            setIsBlocked(true);
            setIsSelection(false);
        }

        function doubleSelectionCompleted() {
            setIsBlocked(true);
            setIsDoubleSelection(false);
        }

        if (!isBlocked) {

            // we supposed to select someone if there is one of the selection modes turn on
            if (isSelection || isDoubleSelection) {

                if (selectedPlayer.id === clientPlayer.id) {
                    console.log("Don't select yourself!");
                    return;
                }

                if (!selectedPlayer.isAlive) {
                    console.log("This player is dead. Stop hitting its grave.");
                    return;
                }

                if (!isJailer && selectedPlayer.isUnderArrest) {
                    console.log("this player is locked up in jail. You can't select him.");
                    return;
                }

                if (timeOfTheDay == "votetime" && actionType == "vote") {
                    const nbr = clientPlayer.role.name === "Mayor" ? 2 : 1;
                    socket.emit("addVote", selectedPlayer.id, nbr, gameId)
                    selectionCompleted()
                    return;
                }

                if (timeOfTheDay == "nighttime" && actionType == "devours") {
                    if (selectedPlayer.role.team.join() !== "werewolves") {
                        const nbr = clientPlayer.role.name === "Alpha Werewolf" ? 2 : 1;
                        socket.emit("addWolfVote", selectedPlayer.id, nbr, gameId)
                        selectionCompleted()
                    } else {
                        console.log("You can't select a wolf")
                    }
                    return;
                }

                else {
                    if (isSelection) {
                        if (isJailer && selectedPlayer.isUnderArrest && actionType == "killPrisoner") {
                            socket.emit("killPrisoner", {
                                type: actionType,
                                killerId: clientPlayer.id,
                                selectedPlayerId: selectedPlayer.id,
                                selectedPlayerName: selectedPlayer.name,
                            }, gameId)
                        } else if (actionType == "reveal") {
                            socket.emit("revealPlayer", {
                                type: actionType,
                                seerId: clientPlayer.id,
                                selectedPlayerId: selectedPlayer.id,
                                selectedPlayerName: selectedPlayer.name,
                            }, gameId)
                        } else if (actionType == "shoot") {
                            socket.emit("shootBullet", {
                                type: actionType,
                                gunnerId: clientPlayer.id,
                                selectedPlayerId: selectedPlayer.id,
                                selectedPlayerName: selectedPlayer.name,
                            }, gameId)
                        } else if (actionType == "heal") {
                            socket.emit("heal", {
                                type: actionType,
                                playerId: clientPlayer.id,
                                selectedPlayerId: selectedPlayer.id,
                                selectedPlayerName: selectedPlayer.name,
                            }, gameId)
                        } else {
                            socket.emit("registerAction", {
                                type: actionType,
                                playerId: clientPlayer.id,
                                selectedPlayerId: selectedPlayer.id,
                                actionTime: clientPlayer.role.canPerform.actionTime,
                            }, gameId);
                        }
                        selectionCompleted()
                        return;
                    } else if (isDoubleSelection && selectedPlayer1 == null) {
                        setSelectedPlayer1(selectedPlayer)
                        return;
                    } else if (isDoubleSelection && selectedPlayer1) {
                        if (actionType == "link") {
                            socket.emit("registerAction", {
                                type: "link",
                                lover1Id: selectedPlayer1.id,
                                lover2Id: selectedPlayer.id,
                                cupidId: clientPlayer.id,
                            }, gameId)
                        }
                        doubleSelectionCompleted()
                        return;
                    }
                }
            } else {
                console.log("no selection modes isn't active ")
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

                    const isAlsoWolf = player.role.team.join() == "werewolves"

                    return (
                        <div
                            key={"plycard-" + player.id}
                            onClick={() => handlePlayerClick(player)}
                            className={
                                `${player.isAlive
                                    ? clientPlayer.id !== player.id
                                        ? (isSelection || (isDoubleSelection && (player.id !== (selectedPlayer1 && selectedPlayer1.id)))) && !isBlocked && (
                                            (clientIsWolf && !isAlsoWolf) || !clientIsWolf
                                        )
                                            ? "bg-red-800 cursor-pointer animate-pulse"
                                            : "bg-slate-800"
                                        : "bg-slate-500"
                                    : "bg-black"
                                } outline outline-2 outline-white w-full md:w-40 h-full md:h-full flex flex-col justify-center items-center relative p-2`
                            }
                        >

                            {timeOfTheDay == "votetime" && (
                                <VoteCount
                                    voteNbr={player.voteAgainst}
                                />
                            )}

                            {timeOfTheDay == "nighttime" && clientIsWolf && !clientPlayer.isUnderArrest && (
                                <VoteCount
                                    voteNbr={player.wolfVoteAgainst}
                                />
                            )}

                            {((clientPlayer.role.name == "Cupid" && player.isInLove) || (clientPlayer.isInLove && player.isInLove)) && (
                                <div className="absolute bottom-0 left-0 m-2 h-6 aspect-square flex justify-center items-center animate-pulse">
                                    <Image
                                        src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706531451/selection/resuscitation_tqyfkl.png"
                                        alt="lover"
                                        width={60}
                                        height={60}
                                    />
                                </div>
                            )}

                            {(player.isRevealed || player.id == clientPlayer.id || (
                                isAlsoWolf && clientIsWolf
                            )) && (
                                    <IconReveal
                                        roleIcon={player.role.image}
                                    />
                                )}

                            <PlayerAvatar isAlive={player.isAlive} isUnderArrest={player.isUnderArrest} avatar={player.avatar} />

                            <p className={`${isSelection && player.id !== clientPlayer.id ? "text-black" : "text-white"} text-xs mt-2`}>{player.name}</p>
                        </div>
                    )
                })
            }

        </div>

    );
}

export default NewPlayersGrid;