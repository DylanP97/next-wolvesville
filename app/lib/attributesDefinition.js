import { schema } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import { Attribute } from "./tabsClasses";

const data = {
  ...schema.properties,
  ...avataaars.schema.properties,
};

export const accessories = new Attribute(
  "accessories",
  "profile.accessories",
  data.accessories.default.concat(["nothing"])
);
export const accessoriesColor = new Attribute(
  "accessoriesColor",
  "profile.accessoriesColor",
  data.accessoriesColor.default
);
export const top = new Attribute(
  "top",
  "profile.top",
  data.top.default.concat(["bald"])
);
export const hatColor = new Attribute(
  "hatColor",
  "profile.hatColor",
  data.hatColor.default
);
export const hairColor = new Attribute(
  "hairColor",
  "profile.hairColor",
  data.hairColor.default
);
export const clothing = new Attribute(
  "clothing",
  "profile.clothing",
  data.clothing.default
);
export const clothesColor = new Attribute(
  "clothesColor",
  "profile.clothesColor",
  data.clothesColor.default
);
export const clothingGraphic = new Attribute(
  "clothingGraphic",
  "profile.clothingGraphic",
  data.clothingGraphic.default.concat(["nothing"])
);
export const facialHair = new Attribute(
  "facialHair",
  "profile.facialHair",
  data.facialHair.default.concat(["nothing"])
);
export const facialHairColor = new Attribute(
  "facialHairColor",
  "profile.facialHairColor",
  data.facialHairColor.default
);
export const mouth = new Attribute(
  "mouth",
  "profile.mouth",
  data.mouth.default
);
export const skinColor = new Attribute(
  "skinColor",
  "profile.skinColor",
  data.skinColor.default
);
export const eyebrows = new Attribute(
  "eyebrows",
  "profile.eyebrows",
  data.eyebrows.default
);
export const eyes = new Attribute(
  "eyes",
  "profile.eyes",
  data.eyes.default
);
