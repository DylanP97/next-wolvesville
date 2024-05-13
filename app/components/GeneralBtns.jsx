"use client";

import LanguageToggle from "./LanguageToggle";
import FullScreenToggle from "./FullScreenToggle";
import LogoutBtn from "./LogoutBtn";

const GeneralBtns = () => {
  return (
    <div className="flex flex-row justify-end items-center w-full border-b-0 border-white bg-black p-2 z-30 h-[10%] gap-2">
      <LanguageToggle />
      <FullScreenToggle />
      <LogoutBtn />
    </div>
  );
};

export default GeneralBtns;
