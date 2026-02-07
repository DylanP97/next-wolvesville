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

export const bodyTab = new Tab(
  "profile.body",
  "👨",
  [top, hatColor, hairColor, eyebrows, eyes, facialHair, facialHairColor, mouth, skinColor]
);

export const clothesTab = new Tab(
  "profile.clothes",
  "👕",
  [clothing, clothesColor, clothingGraphic, accessories, accessoriesColor]
);

export const tabs = [bodyTab, clothesTab];
