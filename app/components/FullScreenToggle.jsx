"use client";

import MaximizeIcon from "./icons/MaximizeIcon";
import MinimizeIcon from "./icons/MinimizeIcon";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";

const FullScreenToggle = ({}) => {
  const { t } = useTranslation();
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  async function enterFullscreen() {
    await document.documentElement.requestFullscreen();
    setFullScreen(true);
  }

  async function exitFullscreen() {
    await document.exitFullscreen();
    setFullScreen(false);
  }

  return (
    <Button
      isIconOnly
      color="primary"
      variant="ghost"
      className="icon-container"
      aria-label={fullScreen ? t("toggle.quit") : t("toggle.go")}
      onPress={() => (fullScreen ? exitFullscreen() : enterFullscreen())}
    >
      {fullScreen ? <MinimizeIcon /> : <MaximizeIcon />}
    </Button>
  );
};

export default FullScreenToggle;
