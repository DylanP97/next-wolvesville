"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import VolumeOffIcon from "./icons/VolumeOffIcon";
import VolumeOnIcon from "./icons/VolumeOnIcon";
import { useSound } from "../../providers/SoundProvider";
import { getBtnClassNames } from "../../lib/styles";

const VolumeToggle = () => {
  const { t } = useTranslation();
  const [isVolumeOn, setIsVolumeOn] = useState(false);
  const { setBgMusicVolume } = useSound();

  const toggleVolume = () => {
    setIsVolumeOn(!isVolumeOn);
    setBgMusicVolume(isVolumeOn ? 0.5 : 0);
  };

  return (
    <Tooltip content={t("change.volume")} color="secondary" variant="faded">
      <Button
        isIconOnly
        size="sm"
        color={!isVolumeOn ? "success" : "danger"}
        variant="solid"
        aria-label="volumeToggle"
        onPress={toggleVolume}
        className={getBtnClassNames("w-10")}
      >
        {isVolumeOn ? <VolumeOffIcon /> : <VolumeOnIcon />}
      </Button>
    </Tooltip>
  );
};

export default VolumeToggle;
