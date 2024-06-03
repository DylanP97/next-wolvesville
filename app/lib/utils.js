import { schema } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import i18n from "./i18n";

export const avataaarsOptions = {
  ...schema.properties,
  ...avataaars.schema.properties,
};

export const defaultAvatar = {
  accessories: [null],
  accessoriesColor: [null],
  accessoriesProbability: 100,
  backgroundColor: ["65c9ff"],
  backgroundType: ["solid"],
  clothesColor: ["262e33"],
  clothing: ["graphicShirt"],
  clothingGraphic: [null],
  eyebrows: ["default"],
  eyes: ["default"],
  facialHair: [null],
  facialHairColor: [null],
  facialHairProbability: 100,
  hairColor: ["4a312c"],
  hatColor: [null],
  mouth: ["default"],
  size: 64,
  skinColor: ["ffdbb4"],
  top: ["shortRound"],
  topProbability: 100,
};

export const colorsForTeams = {
  village: "#36c0c9",
  werewolves: "#5207a3",
  others: "success",
};

export const replacePlaceholders = (msg) => {
  if (msg.includes("{serverContent.")) {
    return msg.replace(/{serverContent\.(.*?)}/g, (_, key) => {
      return i18n.t(`serverContent.${key}`);
    });
  }
  return msg;
};
