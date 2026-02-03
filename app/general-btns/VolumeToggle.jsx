"use client";

import { Button, Tooltip } from "@nextui-org/react";
import { useSound } from "../providers/SoundProvider";
import VolumeOnIcon from "./icons/VolumeOnIcon";
import VolumeOffIcon from "./icons/VolumeOffIcon";
import { getBtnClassNames } from "../lib/styles";

const VolumeToggle = () => {
  const { isMuted, setIsMuted } = useSound();

  const toggleVolume = () => {
    setIsMuted(prev => !prev); // Only toggle mute, don't touch bgMusicVolume
  }

  return (
    <Tooltip content="Toggle volume" color="secondary" variant="faded">
      <span>
        <Button
          isIconOnly
          size="sm"
          color={!isMuted ? "success" : "danger"}
          variant="solid"
          aria-label="volumeToggle"
          onPress={toggleVolume}
          className={getBtnClassNames("w-10")}
        >
          {!isMuted ? <VolumeOnIcon /> : <VolumeOffIcon />}
        </Button>
      </span>
    </Tooltip>
  );
};

export default VolumeToggle;
