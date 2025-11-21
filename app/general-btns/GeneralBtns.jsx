"use client";

import VolumeToggle from "./components/VolumeToggle";
import FullScreenToggle from "./components/FullScreenToggle";
import LogoutBtn from "./components/LogoutBtn";
import DevModeToggle from "./components/DevModeToggle";
import GameMenuExitBtn from "./components/GameMenuExitBtn";
import { useAuth } from "../providers/AuthProvider";
import GoBackBtn from "../components/GoBackBtn";
import { useToRender } from "../providers/RenderProvider";

const GeneralBtns = () => {
  const { isInRoom, isPlaying, isConnected, isDev } = useAuth();
  const { activeComponent } = useToRender();

  if (!isInRoom && !isPlaying) return (
    <div className="absolute top-0 h-[70px] w-full p-4 z-30 flex flex-row justify-end items-center gap-2 z-50">
      <VolumeToggle />
      <FullScreenToggle />
      {
        isConnected && (
          <>
            {
              isDev && <DevModeToggle />
            }
            <LogoutBtn />
            {
              activeComponent?.type?.name !== "HomePage" &&
              <GoBackBtn />
            }
          </>
        )
      }
      {/* <LanguageToggle /> */}

    </div>
  )
};

export default GeneralBtns;
