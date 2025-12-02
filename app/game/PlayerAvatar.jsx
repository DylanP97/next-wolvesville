"use client";

import Image from "next/image";
import prison from "../../public/game/prison.png";
import AvatarUI from "../components/AvatarUI";
import { useAuth } from "../providers/AuthProvider";
import { useEffect } from "react";

const PlayerAvatar = ({ isAlive, isUnderArrest, avatar }) => {

  const { connectedUsers } = useAuth();

  useEffect(() => { 
    console.log("PlayerAvatar - connectedUsers changed:", connectedUsers);
  }, [connectedUsers]);


  return (
    <>
      {!isAlive ? (
        <Image
          width={56}
          height={56}
          className="max-h-[56px] object-contain "
          src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717509814/grave_nmqqmp.png"
          alt="tombstone"
        />
      ) : isUnderArrest ? (
        <Image
          className="max-h-[56px] "
          width={56}
          height={56}
          src={prison}
          alt="prison"
        />
      ) : avatar ? (
        <AvatarUI heightAndWidth={56} avatar={avatar} />
      ) : (
        <Image
          src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717510105/cpu_ir0roq.png"
          height={56}
          width={56}
          alt="cpu-player-avatar"
        />
      )}
    </>
  );
};

export default PlayerAvatar;
