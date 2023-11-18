import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import Image from "next/image";

const AvatarUI = ({ selection, heightAndWidth }) => {
  const avatar = useMemo(() => {
    // Generate a random seed for the avatar
    const randomSeed = Math.random().toString();

    // Create a new avatar using the random seed
    return createAvatar(avataaars, {
      seed: randomSeed, // Use the random seed as the avatar's seed
      size: 128,
    }).toDataUriSync();
  }, []);

  return (
    <Image
      className={selection ? "opacity-50" : ""}
      height={heightAndWidth || 60}
      width={heightAndWidth || 60}
      src={avatar}
      alt="Avatar"
    />
  );
};

export default AvatarUI;
