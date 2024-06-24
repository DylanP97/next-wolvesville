"use client";

import VolumeToggle from "./components/VolumeToggle";
import LanguageToggle from "./components/LanguageToggle";
import FullScreenToggle from "./components/FullScreenToggle";
import LogoutBtn from "./components/LogoutBtn";

const GeneralBtns = () => {

  return (
    <div className="sticky top-0 w-full bg-black p-2 z-30 flex flex-row justify-end items-center gap-2 border-white border-b-2">
      <FullScreenToggle />
      <LanguageToggle />
      <VolumeToggle />
      <LogoutBtn />
    </div>
  );
};

export default GeneralBtns;
