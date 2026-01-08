"use client";

import Image from "next/image";
import AvatarUI from "../../components/AvatarUI";
import { useAuth } from "../../providers/AuthProvider";
import { useEffect } from "react";

const PlayerAvatar = ({ isAlive, avatar, inGameAv, showBurnFlame}) => {

  const { connectedUsers } = useAuth();

  useEffect(() => {
  }, [connectedUsers]);


  return (
    <>
      {!isAlive && !showBurnFlame ? (
        <Image
          width={64}
          height={64}
          className="max-h-[64px] object-contain w-full"
          src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717509814/grave_nmqqmp.png"
          alt="tombstone"
        />
      ) : avatar ? (
        <AvatarUI heightAndWidth={64} avatar={avatar} inGameAv={inGameAv} />
      ) : (
        <Image
          src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717510105/cpu_ir0roq.png"
          height={64}
          width={64}
          alt="cpu-player-avatar"
        />
      )}
    </>
  );
};

export default PlayerAvatar;
