import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const AvatarUI = ({ selection, heightAndWidth, accessories, accessoriesColor, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, hairColor, hatColor, mouth, skinColor, top }) => {
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    let a = createAvatar(avataaars, {
      accessories: [accessories],
      accessoriesColor: [accessoriesColor],
      accessoriesProbability: 100,
      backgroundColor: ["65c9ff"],
      backgroundType: ["solid"],
      clothesColor: [clothesColor || "262e33"],
      clothing: [clothing || "graphicShirt"],
      clothingGraphic: [clothingGraphic],
      eyebrows: [eyebrows || "default"],
      eyes: [eyes || "default"],
      facialHair: [facialHair],
      facialHairColor: [facialHairColor],
      facialHairProbability: 100,
      hairColor: [hairColor || "4a312c"],
      hatColor: [hatColor],
      mouth: [mouth || "default"],
      skinColor: [skinColor || "ffdbb4"],
      top: [top || "shortRound"],
      topProbability: 100,
      size: 64,
    }).toDataUriSync();

    setAvatar(a);
  }, [accessories, accessoriesColor, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, hairColor, hatColor, mouth, skinColor, top]);

  return (
      <Image
        // className={selection ? "opacity-50" : ""}
        height={heightAndWidth || 60}
        width={heightAndWidth || 60}
        src={avatar}
        alt="Avatar"
      />
  );
};

export default AvatarUI;
