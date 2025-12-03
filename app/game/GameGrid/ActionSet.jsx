"use client";

import Image from "next/image";
import { useGame } from "../GameProvider";

const ActionSet = () => {
    const { selectionState } = useGame();
    const { actionEmoji } = selectionState;

    if (!actionEmoji) return null;

    return (
        <div className="absolute -bottom-2 -left-0 w-8 h-8 md:w-10 md:h-10 flex justify-center items-center rounded-full border-2 shadow-lg bg-purple-600 border-purple-800 z-20">
            <Image src={actionEmoji} alt="action" width={24} height={24} />
        </div>
    );
};

export default ActionSet;