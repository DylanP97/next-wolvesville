"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/react";

const avatarCache = new Map();

const AvatarUI = ({ avatar, heightAndWidth, inGameAv }) => {
  const cacheKey = avatar ? JSON.stringify(avatar) : null;
  const [avatarState, setAvatarState] = useState(() => {
    if (cacheKey && avatarCache.has(cacheKey)) return avatarCache.get(cacheKey);
    return undefined;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !avatar) return;
    if (cacheKey && avatarCache.has(cacheKey)) {
      setAvatarState(avatarCache.get(cacheKey));
      return;
    }

    // Dynamic import to avoid SSR issues
    Promise.all([
      import("@dicebear/core"),
      import("@dicebear/collection")
    ]).then(([{ createAvatar }, { avataaars }]) => {
      let a = createAvatar(avataaars, {
        accessories: [avatar.accessories],
        accessoriesColor: [avatar.accessoriesColor],
        accessoriesProbability: 100,
        backgroundColor: ["65c9ff"],
        backgroundType: ["solid"],
        clothesColor: [avatar.clothesColor || "262e33"],
        clothing: [avatar.clothing || "graphicShirt"],
        clothingGraphic: [avatar.clothingGraphic],
        eyebrows: [avatar.eyebrows || "default"],
        eyes: [avatar.eyes || "default"],
        facialHair: [avatar.facialHair],
        facialHairColor: [avatar.facialHairColor],
        facialHairProbability: 100,
        hairColor: [avatar.hairColor || "4a312c"],
        hatColor: [avatar.hatColor],
        mouth: [avatar.mouth || "default"],
        skinColor: [avatar.skinColor || "ffdbb4"],
        top: [avatar.top || "shortRound"],
        topProbability: 100,
        size: 64,
      }).toDataUriSync();

      avatarCache.set(cacheKey, a);
      setAvatarState(a);
    });
  }, [avatar, cacheKey]);

  return avatar && avatarState ? (
    <div
      className={`${inGameAv ? "bg-opacity-0" : "rounded-full border-2 border-white m-1 aspect-square "} bg-white flex justify-center overflow-hidden `}
    >
      <Image
        src={avatarState}
        height={heightAndWidth || 60}
        width={heightAndWidth || 60}
        alt="Avatar"
      />
    </div>
  ) : (
    <CircularProgress color="secondary" aria-label="Loading..." />
  );
};

export default AvatarUI;
