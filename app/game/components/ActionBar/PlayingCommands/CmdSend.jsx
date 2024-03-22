"use client"

import Image from "next/image";
import send from "../../../../../public/game/paper-plane.png"
import { Tooltip } from "@nextui-org/react";

const CmdSend = ({
    sendMessage,
    message
}) => {

    return (
        <Tooltip content={"Send message"} color="secondary" variant="flat">
            <div onClick={() => sendMessage(message)} className=" bg-blue-900 hover:bg-blue-700 w-[60px] h-[60px] p-4 cursor-pointer flex justify-center items-center z-20">
                <Image
                    src={send}
                    alt="send"
                    width={50}
                    height={50}
                    className="max-h-[40px] max-w-[40px] object-contain	"
                />
            </div>
        </Tooltip>
    )
}

export default CmdSend