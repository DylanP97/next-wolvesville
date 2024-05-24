import { schema } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import { Attribute } from "./tabsClasses";
import localsJSON from "../../../public/locales/locals.json";
import i18n from "../../lib/i18n";

const lang = i18n.language;

const data = {
  ...schema.properties,
  ...avataaars.schema.properties,
};

export const accessories = new Attribute(
  `${localsJSON[lang]["translation"]["profile.accessories"]}`,
  data.accessories.default.concat(["nothing"])
);
export const accessoriesColor = new Attribute(
  `${localsJSON[lang]["translation"]["profile.accessoriesColor"]}`,
  data.accessoriesColor.default
);
export const top = new Attribute(
  `${localsJSON[lang]["translation"]["profile.top"]}`,
  data.top.default.concat(["bald"])
);
export const hatColor = new Attribute(
  `${localsJSON[lang]["translation"]["profile.hatColor"]}`,
  data.hatColor.default
);
export const hairColor = new Attribute(
  `${localsJSON[lang]["translation"]["profile.hairColor"]}`,
  data.hairColor.default
);
export const clothing = new Attribute(
  `${localsJSON[lang]["translation"]["profile.clothing"]}`,
  data.clothing.default
);
export const clothesColor = new Attribute(
  `${localsJSON[lang]["translation"]["profile.clothing"]}`,
  data.clothesColor.default
);
export const clothingGraphic = new Attribute(
  `${localsJSON[lang]["translation"]["profile.clothing"]}`,
  data.clothingGraphic.default.concat(["nothing"])
);
export const facialHair = new Attribute(
  `${localsJSON[lang]["translation"]["profile.clothing"]}`,
  data.facialHair.default.concat(["nothing"])
);
export const facialHairColor = new Attribute(
  `${localsJSON[lang]["translation"]["profile.clothing"]}`,
  data.facialHairColor.default
);
export const mouth = new Attribute(
  `${localsJSON[lang]["translation"]["profile.mouth"]}`,
  data.mouth.default
);
export const skinColor = new Attribute(
  `${localsJSON[lang]["translation"]["profile.skinColor"]}`,
  data.skinColor.default
);
export const eyebrows = new Attribute(
  `${localsJSON[lang]["translation"]["profile.eyebrows"]}`,
  data.eyebrows.default
);
export const eyes = new Attribute(
  `${localsJSON[lang]["translation"]["profile.eyes"]}`,
  data.eyes.default
);
