"use client";

import VolumeToggle from "./components/VolumeToggle";
import FullScreenToggle from "./components/FullScreenToggle";
import LogoutBtn from "./components/LogoutBtn";
import DevModeToggle from "./components/DevModeToggle";
import TopExitMenuBtn from "./components/TopExitMenuBtn";
import GoBackBtn from "../components/GoBackBtn";
import { useAuth } from "../providers/AuthProvider";

const GeneralBtns = () => {
  const { isInRoom, isPlaying } = useAuth();

  return (
    <div className="fixed top-0 h-[70px] w-full py-2 px-4 z-30 flex flex-row justify-end items-center gap-2 bg-black">
      <FullScreenToggle />
      {/* <LanguageToggle /> */}
      {
        isInRoom && isPlaying && <>
          <TopExitMenuBtn />
        </>
      }
      <VolumeToggle />

      {
        !isInRoom && !isPlaying && <>
          <DevModeToggle />
          <LogoutBtn />
        </>
      }
    </div>
  );
};

export default GeneralBtns;
