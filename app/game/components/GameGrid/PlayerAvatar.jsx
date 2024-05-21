"use client";

import Image from "next/image";
import AvatarUI from "../../../profile/components/AvatarUI";
import tombstone from "../../../../public/game/tombstone.png";
import prison from "../../../../public/game/prison.png";

const PlayerAvatar = ({ isAlive, isUnderArrest, avatar }) => {
  return (
    <>
      {!isAlive ? (
        <Image width={60} height={60} src={tombstone} alt="tombstone" />
      ) : isUnderArrest ? (
        <Image
          className="max-h-[60px] "
          width={60}
          height={60}
          src={prison}
          alt="prison"
        />
      ) : avatar ? (
        <AvatarUI heightAndWidth={60} avatar={avatar} />
      ) : (
        <Image
          src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1715954141/robot-game_ncwkv7.png"
          height={60}
          width={60}
          alt="cpu-player-avatar"
        />
      )}
    </>
  );
};

export default PlayerAvatar;
