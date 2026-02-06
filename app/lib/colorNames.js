const colorNames = {
  en: {
    // Accessories / Clothes / Hat palette
    "262e33": "Charcoal",
    "65c9ff": "Sky Blue",
    "5199e4": "Royal Blue",
    "25557c": "Navy",
    "e6e6e6": "Light Gray",
    "929598": "Gray",
    "3c4f5c": "Dark Teal",
    "b1e2ff": "Baby Blue",
    "a7ffc4": "Mint",
    "ffdeb5": "Peach",
    "ffafb9": "Pink",
    "ffffb1": "Pale Yellow",
    "ff488e": "Hot Pink",
    "ff5c5c": "Coral",
    "ffffff": "White",
    // Hair / Facial Hair palette
    "a55728": "Auburn",
    "2c1b18": "Black",
    "b58143": "Caramel",
    "d6b370": "Dirty Blonde",
    "724133": "Dark Brown",
    "4a312c": "Chocolate",
    "f59797": "Strawberry",
    "ecdcbf": "Platinum",
    "c93305": "Ginger",
    "e8e1e1": "Silver",
    // Skin palette
    "614335": "Espresso",
    "d08b5b": "Tan",
    "ae5d29": "Bronze",
    "edb98a": "Light Tan",
    "ffdbb4": "Fair",
    "fd9841": "Golden",
    "f8d25c": "Honey",
  },
  fr: {
    // Accessories / Clothes / Hat palette
    "262e33": "Anthracite",
    "65c9ff": "Bleu ciel",
    "5199e4": "Bleu royal",
    "25557c": "Marine",
    "e6e6e6": "Gris clair",
    "929598": "Gris",
    "3c4f5c": "Bleu sombre",
    "b1e2ff": "Bleu pastel",
    "a7ffc4": "Menthe",
    "ffdeb5": "P\u00eache",
    "ffafb9": "Rose",
    "ffffb1": "Jaune p\u00e2le",
    "ff488e": "Rose vif",
    "ff5c5c": "Corail",
    "ffffff": "Blanc",
    // Hair / Facial Hair palette
    "a55728": "Auburn",
    "2c1b18": "Noir",
    "b58143": "Caramel",
    "d6b370": "Blond v\u00e9nitien",
    "724133": "Brun fonc\u00e9",
    "4a312c": "Chocolat",
    "f59797": "Fraise",
    "ecdcbf": "Platine",
    "c93305": "Roux",
    "e8e1e1": "Argent\u00e9",
    // Skin palette
    "614335": "Expresso",
    "d08b5b": "H\u00e2l\u00e9",
    "ae5d29": "Bronze",
    "edb98a": "Beige clair",
    "ffdbb4": "Clair",
    "fd9841": "Dor\u00e9",
    "f8d25c": "Miel",
  },
};

export function getColorName(hex, lang = "en") {
  const langKey = lang.substring(0, 2);
  const names = colorNames[langKey] || colorNames.en;
  return names[hex] || hex;
}
