import {
  accessories,
  accessoriesColor,
  clothesColor,
  clothing,
  clothingGraphic,
  eyebrows,
  eyes,
  facialHair,
  facialHairColor,
  hairColor,
  hatColor,
  mouth,
  skinColor,
  top,
} from "./attributesDefinition";
import { Tab } from "./tabsClasses";
import localsJSON from "../../../public/locales/locals.json";
import i18n from "../../lib/i18n";

const lang = i18n.language;

export const headTab = new Tab(
  `${localsJSON[lang]["translation"]["profile.head"]}`,
  "👓",
  [accessories, accessoriesColor, top, hatColor, hairColor]
);

export const clothesTab = new Tab(
  `${localsJSON[lang]["translation"]["profile.clothes"]}`,
  "👕",
  [clothing, clothesColor, clothingGraphic]
);

export const bodyTab = new Tab(
  `${localsJSON[lang]["translation"]["profile.body"]}`,
  "👨",
  [facialHair, facialHairColor, mouth, skinColor]
);

export const eyesTab = new Tab(
  `${localsJSON[lang]["translation"]["profile.eyes"]}`,
  "👁️",
  [eyebrows, eyes]
);

export const tabs = [headTab, clothesTab, bodyTab, eyesTab];
