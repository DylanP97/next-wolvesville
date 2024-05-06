'use client'

import AvatarUI from "../profile/Profile/AvatarUI";
import { useTranslation } from "react-i18next";

const AuthInfo = ({ username, socketId, isInRoom, avatar }) => {
    const { t } = useTranslation();

    const welcomeMsgs = [
        `👋 How is it going ${username}?`,
        `😀 Great to see you ${username}!`,
        `🐺 Ready to play ${username}?`
    ]

    const randomIndex = Math.floor(Math.random() * welcomeMsgs.length);

    return (
        <header className="p-4 flex justify-center items-center">
            <div className="mx-2 flex items-center justify-center bg-primary rounded-full overflow-hidden">
                <AvatarUI avatar={avatar} heightAndWidth={80} />
            </div>
            <div className="h-full">
                <p className="text-md text-white">{welcomeMsgs[randomIndex]}</p>
                {isInRoom ? (
                    <p className="text-md text-white">🟢 Is in a Room: {isInRoom}</p>
                ) : (
                    <p className="text-md text-white">🔴 Not in a Room</p>
                )}
            </div>
        </header>
    )
}

export default AuthInfo