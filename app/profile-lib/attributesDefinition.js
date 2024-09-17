import { schema } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import { Attribute } from "./tabsClasses";
import localsJSON from "../../public/locals.json";
import i18n from "../lib/i18n";

const lang = i18n.language;

const data = {
  ...schema.properties,
  ...avataaars.schema.properties,
};

export const accessories = new Attribute(
  "accessories",
  `${localsJSON[lang]["translation"]["profile.accessories"]}`,
  data.accessories.default.concat(["nothing"])
);
export const accessoriesColor = new Attribute(
  "accessoriesColor",
  `${localsJSON[lang]["translation"]["profile.accessoriesColor"]}`,
  data.accessoriesColor.default
);
export const top = new Attribute(
  "top",
  `${localsJSON[lang]["translation"]["profile.top"]}`,
  data.top.default.concat(["bald"])
);
export const hatColor = new Attribute(
  "hatColor",
  `${localsJSON[lang]["translation"]["profile.hatColor"]}`,
  data.hatColor.default
);
export const hairColor = new Attribute(
  "hairColor",
  `${localsJSON[lang]["translation"]["profile.hairColor"]}`,
  data.hairColor.default
);
export const clothing = new Attribute(
  "clothing",
  `${localsJSON[lang]["translation"]["profile.clothing"]}`,
  data.clothing.default
);
export const clothesColor = new Attribute(
  "clothesColor",
  `${localsJSON[lang]["translation"]["profile.clothesColor"]}`,
  data.clothesColor.default
);
export const clothingGraphic = new Attribute(
  "clothingGraphic",
  `${localsJSON[lang]["translation"]["profile.clothingGraphic"]}`,
  data.clothingGraphic.default.concat(["nothing"])
);
export const facialHair = new Attribute(
  "facialHair",
  `${localsJSON[lang]["translation"]["profile.facialHair"]}`,
  data.facialHair.default.concat(["nothing"])
);
export const facialHairColor = new Attribute(
  "facialHairColor",
  `${localsJSON[lang]["translation"]["profile.facialHairColor"]}`,
  data.facialHairColor.default
);
export const mouth = new Attribute(
  "mouth",
  `${localsJSON[lang]["translation"]["profile.mouth"]}`,
  data.mouth.default
);
export const skinColor = new Attribute(
  "skinColor",
  `${localsJSON[lang]["translation"]["profile.skinColor"]}`,
  data.skinColor.default
);
export const eyebrows = new Attribute(
  "eyebrows",
  `${localsJSON[lang]["translation"]["profile.eyebrows"]}`,
  data.eyebrows.default
);
export const eyes = new Attribute(
  "eyes",
  `${localsJSON[lang]["translation"]["profile.eyes"]}`,
  data.eyes.default
);
