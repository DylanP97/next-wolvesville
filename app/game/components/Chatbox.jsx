"use client";
import { Button, Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import Image from "next/image";
import send from "../../../public/game/paper-plane.png"

const Chatbox = ({ timeOfTheDay, gameId, clientPlayer }) => {
    const { socket, username } = useAuth();
    const [message, setMessage] = useState("");

    const isWolf = clientPlayer.role.team.join() == "werewolves"

    const sendMessage = (message) => {
        const isWolvesChat = (timeOfTheDay == "nighttime" && isWolf ? true : false)
        console.log(isWolvesChat)
        socket.emit("sendMessage", message, gameId, username, isWolvesChat)
        setMessage("");
    }

    useEffect(() => {
        setMessage("");
    }, [timeOfTheDay])

    if (!isWolf && timeOfTheDay == "nighttime") {
        return;
    } else {
        return (
            <div className="flex flex-row w-full gap-2">
                <Textarea
                    color="secondary"
                    variant="flat"
                    isDisabled={timeOfTheDay == "nighttime" && false}
                    label="Write a message here"
                    labelPlacement="inside"
                    placeholder=""
                    defaultValue=""
                    className="h-20"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div onClick={() => sendMessage(message)} className="mt-2 cursor-pointer rounded-xl flex justify-center items-center py-[10px] px-[10px] w-[50px] h-[50px] bg-slate-900">
                    <Image
                        src={send}
                        alt="sendMessage"
                        width={50}
                        height={50}
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>
            </div>
        )
    }
}

export default Chatbox