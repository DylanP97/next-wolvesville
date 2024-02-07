import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const AvatarUI = ({ selection, heightAndWidth, accessories, accessoriesColor, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, hairColor, hatColor, mouth, skinColor, top }) => {
  const [avatar, setAvatar] = useState();

  console.log(skinColor)

  useEffect(() => {
    let a = createAvatar(avataaars, {
      accessories: [accessories],
      accessoriesColor: [accessoriesColor],
      accessoriesProbability: 100,
      backgroundColor: ["65c9ff"],
      backgroundType: ["solid"],
      clothesColor: [clothesColor || "262e33"],
      clothing: [clothing || "blazerAndShirt"],
      clothingGraphic: [clothingGraphic],
      eyebrows: [eyebrows],
      eyes: [eyes || "default"],
      facialHair: [facialHair],
      facialHairColor: [facialHairColor],
      facialHairProbability: 100,
      hairColor: [hairColor],
      hatColor: [hatColor],
      mouth: [mouth || "default"],
      skinColor: [skinColor || "#d08b5b"],
      top: [top],
      topProbability: 100,
      size: 64,
    }).toDataUriSync();

    setAvatar(a);
  }, [accessories, accessoriesColor, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, hairColor, hatColor, mouth, skinColor, top]);

  return (
    <div className="bg-white flex justify-center">
      <Image
        // className={selection ? "opacity-50" : ""}
        height={heightAndWidth || 60}
        width={heightAndWidth || 60}
        src={avatar}
        alt="Avatar"
      />
    </div>
  );
};

export default AvatarUI;
