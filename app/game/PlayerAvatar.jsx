"use client";

import Image from "next/image";
import prison from "../../public/game/prison.png";
import AvatarUI from "../components/AvatarUI";

const PlayerAvatar = ({ isAlive, isUnderArrest, avatar }) => {
  return (
    <>
      {!isAlive ? (
        <Image
          width={40}
          height={40}
          className="max-h-[40px] object-contain "
          src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717509814/grave_nmqqmp.png"
          alt="tombstone"
        />
      ) : isUnderArrest ? (
        <Image
          className="max-h-[40px] "
          width={40}
          height={40}
          src={prison}
          alt="prison"
        />
      ) : avatar ? (
        <AvatarUI heightAndWidth={40} avatar={avatar} />
      ) : (
        <Image
          src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717510105/cpu_ir0roq.png"
          height={40}
          width={40}
          alt="cpu-player-avatar"
        />
      )}
    </>
  );
};

export default PlayerAvatar;
