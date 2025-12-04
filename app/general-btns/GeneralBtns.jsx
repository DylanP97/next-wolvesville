"use client";

import VolumeToggle from "./VolumeToggle";
import FullScreenToggle from "./FullScreenToggle";
import LanguageToggle from "./LanguageToggle";
import LogoutBtn from "./LogoutBtn";
import DevModeToggle from "./DevModeToggle";
import GameMenuExitBtn from "./GameMenuExitBtn";
import { useAuth } from "../providers/AuthProvider";
import GoBackBtn from "../components/GoBackBtn";
import { useToRender } from "../providers/RenderProvider";
import TrackDisplay from "./TrackDisplay";

const GeneralBtns = () => {
  const { isInRoom, isPlaying, isConnected, isDev } = useAuth();
  const { activeComponent } = useToRender();

  if (!isPlaying) return (
    <div className="fixed top-0 h-[70px] w-full p-4 z-30 flex flex-row justify-end items-center gap-2 z-50">
      {
        activeComponent?.type?.displayName === "HomePage" && <TrackDisplay />
      }
      <VolumeToggle />
      <LanguageToggle />
      <FullScreenToggle />
      {
        isConnected && (
          <>
            {
              isDev && <DevModeToggle />
            }
            <LogoutBtn />
            {
              activeComponent?.type?.displayName !== "HomePage" &&
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
