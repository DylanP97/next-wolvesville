"use client";

import VolumeToggle from "./components/VolumeToggle";
import LanguageToggle from "./components/LanguageToggle";
import FullScreenToggle from "./components/FullScreenToggle";
import LogoutBtn from "./components/LogoutBtn";

const GeneralBtns = () => {

  return (
    <div className="fixed top-0 w-full p-2 z-30 flex flex-row justify-end items-center gap-2">
      <FullScreenToggle />
      {/* <LanguageToggle /> */}
      <VolumeToggle />
      <LogoutBtn />
    </div>
  );
};

export default GeneralBtns;
