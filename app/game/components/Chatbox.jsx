"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import Image from "next/image";
import send from "../../../public/game/paper-plane.png"
import { useKeys } from "../../providers/KeysProvider";

const Chatbox = ({ timeOfTheDay, gameId, clientPlayer }) => {
    const { socket, username } = useAuth();
    const { currentKey, setCurrentKey } = useKeys();
    const [message, setMessage] = useState("");

    const isJailer = clientPlayer.role.name === "Jailer"
    const isJailerChat = clientPlayer.isUnderArrest || (isJailer && timeOfTheDay == "nighttime" && clientPlayer.hasHandcuffed)
    const isWolf = clientPlayer.role.team.join() == "werewolves"
    const isWolvesChat = (timeOfTheDay == "nighttime" && isWolf ? true : false)

    const sendMessage = (message) => {
        if (message) {
            socket.emit("sendMessage", message, gameId, username, isWolvesChat, isJailerChat, isJailer)
            setMessage("");
        } else {
            console.log("rien n'est écrit")
        }
    }

    useEffect(() => {
        if (currentKey == "Enter") sendMessage(message)
        setCurrentKey(null)
    })

    useEffect(() => {
        setMessage("");
    }, [timeOfTheDay])

    if (!isWolf && !isJailerChat && timeOfTheDay == "nighttime") {
        return (
            <>
            </>
        )
    } else {
        return (
            <div className="flex flex-row w-full gap-2">
                <textarea
                    disabled={!timeOfTheDay == "nighttime" && (!isJailerChat || !isWolf) && false}
                    placeholder="Write a message"
                    value={message}
                    className="outline-none border-none w-full p-2 h-[60px] text-black z-20"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div onClick={() => sendMessage(message)} className="absolute right-0 w-[60px] h-[60px] p-1 cursor-pointer flex justify-center items-center bg-slate-900 z-20">
                    <Image
                        src={send}
                        alt="sendMessage"
                        width={50}
                        height={50}
                        className=""
                    />
                </div>
            </div>
        )
    }
}

export default Chatbox