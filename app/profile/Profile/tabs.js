import { schema } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

class Attribute {
  constructor(label, options) {
    (this.label = label), (this.options = options);
  }
}

class Tab {
  constructor(title, emoji, attributes) {
    (this.title = title), (this.emoji = emoji), (this.attributes = attributes);
  }
}

const data = {
  ...schema.properties,
  ...avataaars.schema.properties,
};

const accessories = new Attribute(
  "accessories",
  data.accessories.default.concat(["nothing"])
);

const accessoriesColor = new Attribute(
  "accessoriesColor",
  data.accessoriesColor.default
);

const top = new Attribute("top", data.top.default.concat(["bald"]));

const hatColor = new Attribute("hatColor", data.hatColor.default);

const hairColor = new Attribute("hairColor", data.hairColor.default);

const clothing = new Attribute("clothing", data.clothing.default);

const clothesColor = new Attribute("clothesColor", data.clothesColor.default);

const clothingGraphic = new Attribute(
  "clothingGraphic",
  data.clothingGraphic.default.concat(["nothing"])
);

const facialHair = new Attribute(
  "facialHair",
  data.facialHair.default.concat(["nothing"])
);

const facialHairColor = new Attribute(
  "facialHairColor",
  data.facialHairColor.default
);

const mouth = new Attribute("mouth", data.mouth.default);

const skinColor = new Attribute("skinColor", data.skinColor.default);

const eyebrows = new Attribute("eyebrows", data.eyebrows.default);

const eyes = new Attribute("eyes", data.eyes.default);

export const headTab = new Tab("head", "👓", [
  accessories,
  accessoriesColor,
  top,
  hatColor,
  hairColor,
]);

export const clothesTab = new Tab("clothes", "👕", {
  clothing,
  clothesColor,
  clothingGraphic,
});

export const bodyTab = new Tab("body", "👨", {
  facialHair,
  facialHairColor,
  mouth,
  skinColor,
});

export const eyesTab = new Tab("eyes", "👁️", {
  eyebrows,
  eyes,
});

export const tabs = [headTab, clothesTab, bodyTab, eyesTab];
