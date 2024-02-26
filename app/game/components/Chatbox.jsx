"use client";

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
        socket.emit("sendMessage", message, gameId, username, isWolvesChat)
        setMessage("");
    }

    useEffect(() => {
        setMessage("");
    }, [timeOfTheDay])

    if (!isWolf && timeOfTheDay == "nighttime") {
        return (
            <>
            </>
        )
    } else {
        return (
            <div className="flex flex-row w-full gap-2">
                <textarea
                    isDisabled={timeOfTheDay == "nighttime" && false}
                    placeholder="Write a message"
                    defaultValue=""
                    value={message}
                    className="outline-none border-none w-full p-2 h-[40px]"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div onClick={() => sendMessage(message)} className="absolute right-0 cursor-pointer flex justify-center items-center p-[10px] w-[40px] h-[40px] bg-slate-900">
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