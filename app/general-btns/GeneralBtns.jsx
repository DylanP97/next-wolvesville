"use client";

import VolumeToggle from "./components/VolumeToggle";
import FullScreenToggle from "./components/FullScreenToggle";
import LogoutBtn from "./components/LogoutBtn";
import DevModeToggle from "./components/DevModeToggle";
import GoBackBtn from "../components/GoBackBtn";
import { useAuth } from "../providers/AuthProvider";

const GeneralBtns = () => {
  const { isInRoom, isPlaying } = useAuth();

  return (
    <div className="fixed top-0 w-full p-2 z-30 flex flex-row justify-end items-center gap-2">
      <FullScreenToggle />
      {/* <LanguageToggle /> */}
      <VolumeToggle />
      <DevModeToggle />
      <LogoutBtn />
    </div>
  );
};

export default GeneralBtns;
