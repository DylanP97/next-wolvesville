"use client";

import VolumeToggle from "./VolumeToggle";
import LanguageToggle from "./LanguageToggle";
import FullScreenToggle from "./FullScreenToggle";
import LogoutBtn from "./LogoutBtn";

const GeneralBtns = () => {
  return (
    <div className="relative w-full">
      <div className="fixed top-0 w-full h-10 group z-30">
        <div className="fixed top-0 w-full bg-black p-2 z-30 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-row justify-end items-center gap-2">
          <VolumeToggle />
          <LanguageToggle />
          <FullScreenToggle />
          <LogoutBtn />
        </div>
      </div>
    </div>
  );
};

export default GeneralBtns;
