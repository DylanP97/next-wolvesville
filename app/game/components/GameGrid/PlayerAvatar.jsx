"use client";

import Image from "next/image";
import AvatarUI from "../../../profile/components/AvatarUI";
import prison from "../../../../public/game/prison.png";

const PlayerAvatar = ({ isAlive, isUnderArrest, avatar }) => {
  return (
    <>
      {!isAlive ? (
        <Image
          width={80}
          height={80}
          className="max-h-[60px] object-contain "
          src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717509814/grave_nmqqmp.png"
          alt="tombstone"
        />
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
          src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717510105/cpu_ir0roq.png"
          height={60}
          width={60}
          alt="cpu-player-avatar"
        />
      )}
    </>
  );
};

export default PlayerAvatar;
