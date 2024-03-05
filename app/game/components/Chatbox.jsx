"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import Image from "next/image";
import send from "../../../public/game/paper-plane.png"

const Chatbox = ({ timeOfTheDay, gameId, clientPlayer }) => {
    const { socket, username } = useAuth();
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
                    className="outline-none border-none w-full p-2 h-[40px] text-black z-20"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div datatype="sendButn" onClick={() => sendMessage(message)} className="absolute right-0 cursor-pointer flex justify-center items-center p-[10px] w-[40px] h-[40px] bg-slate-900 z-20">
                    <Image
                        src={send}
                        alt="sendMessage"
                        width={40}
                        height={40}
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>
            </div>
        )
    }
}

export default Chatbox