"use client";

import { Button } from "@nextui-org/react";
import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";
import MaximizeIcon from "./icons/MaximizeIcon";
import MinimizeIcon from "./icons/MinimizeIcon";
import LanguageToggle from "./LanguageToggle";

const GeneralBtns = () => {
  const { isConnected } = useAuth();
  const [fullScreen, setFullScreen] = useState(false);

  async function enterFullscreen() {
    await document.documentElement.requestFullscreen();
    setFullScreen(true);
  }

  async function exitFullscreen() {
    await document.exitFullscreen();
    setFullScreen(false);
  }

  return (
    <div className="flex flex-row justify-end items-center w-full border-b-0 border-white bg-black p-2 z-30 h-[10%] gap-2">
      <LanguageToggle />
      <Button
        isIconOnly
        color="primary"
        variant="ghost"
        aria-label={fullScreen ? "Quit Full Screen" : "Go Full Screen"}
        onPress={() => (fullScreen ? exitFullscreen() : enterFullscreen())}
      >
        {fullScreen ? <MinimizeIcon /> : <MaximizeIcon />}
      </Button>
      {isConnected && (
        <Button
          variant="ghost"
          color="primary"
          aria-label="Logout"
          onPress={() => document.location.assign("/")}
        >
          Logout
        </Button>
      )}
    </div>
  );
};

export default GeneralBtns;
