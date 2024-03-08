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
        console.log(message.length)
        console.log(typeof message)
        if (message) {
            socket.emit("sendMessage", message, gameId, username, isWolvesChat, isJailerChat, isJailer)
            setMessage("");
        } else {
            console.log("rien n'est écrit")
        }
    }

    useEffect(() => {
        if (currentKey == "Enter") {
            sendMessage(message)
            setCurrentKey(null)
            setMessage("")
        }
    }, [currentKey])

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
            <div className="relative flex flex-row">
                <input
                    disabled={!timeOfTheDay == "nighttime" && (!isJailerChat || !isWolf) && false}
                    placeholder="Write a message"
                    value={message}
                    className="outline-none border-none p-2 h-[60px] text-black z-20"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div onClick={() => sendMessage(message)} className="absolute right-0 w-[60px] h-[60px] p-2 cursor-pointer flex justify-center items-center bg-blue-900 z-20 hover:bg-blue-700">
                    <Image
                        src={send}
                        alt="send"
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