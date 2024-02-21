"use client"

import Image from "next/image";
import AvatarUI from "../../profile/Profile/AvatarUI";
import tombstone from "../../../public/game/tombstone.png"
import { Button, Card } from "@nextui-org/react";
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
                    const isMayor = clientPlayer.role.name === "Mayor" ? 2 : 1;
                    socket.emit("addVote", selectedPlayer.id, isMayor, gameId)
                    setIsBlocked(true);
                    setIsSelection(false);
                    console.log("hello ;)))))")
                    return;
                } else {
                    socket.emit("registerAction", {
                        type: clientPlayer.role.canPerform.type,
                        player: clientPlayer.id,
                        selectedPlayerId: selectedPlayer.id,
                        actionTime: clientPlayer.role.canPerform.actionTime,
                    }, gameId);
                    setIsBlocked(true)
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
        <div className={`${isSelection ? "" : ""} flex flex-row gap-2 my-4 place-items-center xl:w-[80%]`}>
            {
                playersList.map((player) => {
                    return (
                        <div key={player.id}
                            onClick={() => handlePlayerClick(player)}
                            className={`${player.isAlive
                                ? clientPlayer.id !== player.id
                                    ? isSelection && !isBlocked
                                        ? "bg-red-800 cursor-pointer animate-pulse"
                                        : "bg-gray-800"
                                    : "bg-gray-900 border-2 border-solid border-pink-500"
                                : "bg-black"
                                }
                                w-full md:w-48 h-full md:h-full flex flex-col justify-center items-center relative rounded-xl md:rounded-3xl`}
                        >
                            {!player.isAlive ? (
                                <Image className="" width={100} height={100} src={tombstone} alt="role" />
                            ) : player.isRevealed ? (
                                <Image
                                    src={player.role.image}
                                    width={100}
                                    height={100}
                                    alt="role"
                                />
                            ) : (
                                <AvatarUI heightAndWidth={100} accessories={player.avatar.accessories} accessoriesColor={player.avatar.accessoriesColor} clothesColor={player.avatar.clothesColor} clothing={player.avatar.clothing} clothingGraphic={player.avatar.clothingGraphic} eyebrows={player.avatar.eyebrows} eyes={player.avatar.eyes} facialHair={player.avatar.facialHair}
                                facialHairColor={player.avatar.facialHairColor} hairColor={player.avatar.hairColor} hatColor={player.avatar.hatColor} mouth={player.avatar.mouth} size={player.avatar.size} skinColor={player.avatar.skinColor} top={player.avatar.top} />
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