"use client"

import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import voteAgainstIcon from "../../../public/game/vote-time.png";

const CmdVote = ({
    activateSelection,
    isSelection
}) => {

    return (
        <Tooltip content={"Choose a player to vote against"}>
            <div
                onClick={() => activateSelection("vote")}
                className={`${isSelection ? 'bg-slate-900' : 'bg-red-800 hover:bg-red-600'}
            w-[60px] h-[60px] p-2 cursor-pointer flex justify-center items-center z-20`}
            >
                <Image
                    src={voteAgainstIcon.src}
                    alt="voteAgainst"
                    width={50}
                    height={50}
                    className=""
                />
            </div>
        </ Tooltip>
    )
}

export default CmdVote