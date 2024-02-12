"use client";
import { Button, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

const Chatbox = ({ }) => {
    const { game, socket, username } = useAuth();

    const [message, setMessage] = useState("");

    const sendMessage = (message) => {
        socket.emit("sendMessage", message, game.id, username)
    }

    return (
        <div className="w-[80%] relative">
            <textarea
                className="w-full rounded-xl outline-none resize-none text-black text-sm p-1 max-h-12 "
                placeholder="write a message here"
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={() => sendMessage(message)} className="absolute right-0 top-0 h-full" color="primary">
                Send
            </Button>
        </div>
    )
}

export default Chatbox