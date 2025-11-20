"use client";

import VolumeToggle from "./components/VolumeToggle";
import FullScreenToggle from "./components/FullScreenToggle";
import LogoutBtn from "./components/LogoutBtn";
import DevModeToggle from "./components/DevModeToggle";
import TopExitMenuBtn from "./components/TopExitMenuBtn";
import { useAuth } from "../providers/AuthProvider";

const GeneralBtns = () => {
  const { isInRoom, isPlaying } = useAuth();

  // if (isInRoom && isPlaying) return (
  //   <div className="fixed top-0 left-0 mx-1 z-50">
  //     <TopExitMenuBtn />
  //   </div>
  // )

  if (!isInRoom && !isPlaying) return (
    <div className="top-0 h-[70px] w-full p-4 z-30 flex flex-row justify-end items-center gap-2 z-50">
      <VolumeToggle />
      <FullScreenToggle />
      <DevModeToggle />
      <LogoutBtn />
      {/* <LanguageToggle /> */}

    </div>
  )
};

export default GeneralBtns;
