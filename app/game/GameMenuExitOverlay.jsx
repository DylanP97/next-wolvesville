"use client";

import QuitGameBtn from "../components/QuitGameBtn";
import DevModeToggle from "../general-btns/DevModeToggle";
import LogoutBtn from "../general-btns/LogoutBtn";
import VolumeToggle from "../general-btns/VolumeToggle";
import FullScreenToggle from "../general-btns/FullScreenToggle";
import { useAuth } from "../providers/AuthProvider";
import LanguageToggle from "../general-btns/LanguageToggle";

const GameMenuExitOverlay = ({ isOpen, onClose }) => {
    const { isDev } = useAuth();
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
                       bg-black/40 backdrop-blur-xs"
            onClick={onClose}
        >
            <div className="flex flex-col gap-4 items-center justify-center ">
                <div className="flex gap-2">
                    <LogoutBtn />
                    <VolumeToggle />
                    <FullScreenToggle />
                    <LanguageToggle />
                </div>
                {
                    isDev && <DevModeToggle />
                }
                <QuitGameBtn />
            </div>
        </div>
    );
};

export default GameMenuExitOverlay;
