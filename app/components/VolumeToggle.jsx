"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import VolumeOffIcon from "./icons/VolumeOffIcon";
import VolumeOnIcon from "./icons/VolumeOnIcon";

const VolumeToggle = () => {
  const { t } = useTranslation();
  const [isVolumeOn, setIsVolumeOn] = useState(false);

  const toggleVolume = () => {
    setIsVolumeOn(!isVolumeOn);
  };

  return (
    <Tooltip content={t("change.volume")} color="secondary" variant="faded">
      <Button
        isIconOnly
        color="secondary"
        variant="solid"
        aria-label="volumeToggle"
        onPress={toggleVolume}
        className="icon-container"
      >
        {isVolumeOn ? <VolumeOnIcon /> : <VolumeOffIcon />}
      </Button>
    </Tooltip>
  );
};

export default VolumeToggle;
