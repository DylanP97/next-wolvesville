"use client";

import Image from "next/image";
import { useGame } from "./GameProvider";

const ActionSet = () => {
    const { selectionState } = useGame();
    const { actionEmoji } = selectionState;

    if (!actionEmoji) return null;

    return (
        <div className="absolute -bottom-2 -right-0 w-10 h-10 flex justify-center items-center rounded-full border-2 shadow-lg bg-purple-600 border-purple-800">
            <Image src={actionEmoji} alt="action" width={32} height={32} />
        </div>
    );
};

export default ActionSet;