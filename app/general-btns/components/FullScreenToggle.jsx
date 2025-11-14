"use client";

import MaximizeIcon from "./icons/MaximizeIcon";
import MinimizeIcon from "./icons/MinimizeIcon";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { useKeys } from "../../providers/KeysProvider";
import { btnClassNames, getBtnClassNames } from "../../lib/styles";

const FullScreenToggle = ({}) => {
  const { currentKey, setCurrentKey } = useKeys();
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

  useEffect(() => {
    if (currentKey === "F" || currentKey === "f") {
      fullScreen ? exitFullscreen() : enterFullscreen();
      setCurrentKey(null);
    }
  }, [currentKey]);

  async function enterFullscreen() {
    await document.documentElement.requestFullscreen();
    setFullScreen(true);
  }

  async function exitFullscreen() {
    await document.exitFullscreen();
    setFullScreen(false);
  }

  return (
    <Tooltip
      content={fullScreen ? t("toggle.quit") : t("toggle.go")}
      color="secondary"
      variant="flat"
    >
      <Button
        isIconOnly
        size="sm"
        color={fullScreen ? "success" : "secondary"}
        variant="solid"
        className={getBtnClassNames("w-10")}
        // className="icon-container"
        // aria-label={fullScreen ? t("toggle.quit") : t("toggle.go")}
        onPress={() => (fullScreen ? exitFullscreen() : enterFullscreen())}
      >
        {fullScreen ? <MinimizeIcon /> : <MaximizeIcon />}
      </Button>
    </Tooltip>
  );
};

export default FullScreenToggle;
