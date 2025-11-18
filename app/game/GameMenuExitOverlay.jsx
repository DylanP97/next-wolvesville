"use client";

import GoBackBtn from "../components/GoBackBtn";
import DevModeToggle from "../general-btns/components/DevModeToggle";
import LogoutBtn from "../general-btns/components/LogoutBtn";

const GameMenuExitOverlay = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
                       bg-black/40 backdrop-blur-xs"
            onClick={onClose}
        >
            <div className="flex flex-col gap-4 items-center justify-center ">
                <DevModeToggle />
                <GoBackBtn />
                <LogoutBtn />
            </div>
        </div>
    );
};

export default GameMenuExitOverlay;
