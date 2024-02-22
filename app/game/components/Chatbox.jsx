"use client";
import { Button, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import Image from "next/image";
import send from "../../../public/game/paper-plane.png"

const Chatbox = ({ timeOfTheDay, gameId, clientPlayer }) => {
    const { socket, username } = useAuth();
    const [message, setMessage] = useState("");

    const sendMessage = (message) => {
        socket.emit("sendMessage", message, gameId, username, (timeOfTheDay == "nighttime" && clientPlayer.role.team.join() == "werewolves") ? true : false)
    }

    return (
        <div className="flex flex-col">
            <Textarea
                color="secondary"
                variant="flat"
                isDisabled={timeOfTheDay == "nighttime" && false}
                label="Write a message here"
                labelPlacement="inside"
                placeholder=""
                defaultValue=""
                className="h-20 w-1/2"
                onChange={(e) => setMessage(e.target.value)}
            />
            <div onClick={() => sendMessage(message)} className="w-[50px] p-[5px] mt-2 cursor-pointer rounded-xl flex justify-center items-center py-[10px] px-[10px] w-[50px] bg-blue-700" color="primary">
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

export default Chatbox