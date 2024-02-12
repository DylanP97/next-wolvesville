"use client"

import Image from "next/image";
import AvatarUI from "../../profile/Profile/AvatarUI";
import tombstone from "../../../public/game/tombstone.png"
import { Button, Card } from "@nextui-org/react";

const NewPlayersGrid = ({
    isSelection,
    playersList
}) => {

    return (
        <div className="flex flex-row gap-2 my-4 place-items-center xl:w-[80%]">
            {
                playersList.map((player) => {
                    return (
                        <Card key={player.id} className={`${isSelection && "animate-pulse hover:cursor-pointer hover:bg-gray-200"} p-2 w-28 flex flex-col items-center`}>
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