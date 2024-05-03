import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/react";

const AvatarUI = ({
  avatar, heightAndWidth
  // selection, accessories, accessoriesColor, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, hairColor, hatColor, mouth, skinColor, top 
}) => {
  const [avatarR, setAvatarR] = useState("");

  useEffect(() => {
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

    setAvatarR(a);
  }, [
    avatar
    // accessories, accessoriesColor, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, hairColor, hatColor, mouth, skinColor, top
  ]);

  return avatar && avatarR ? (
    <Image
      src={avatarR}
      
      height={heightAndWidth || 60}
      width={heightAndWidth || 60}
      alt="Avatar"
    />
  ) : <CircularProgress color="secondary" aria-label="Loading..." />
};

export default AvatarUI;
