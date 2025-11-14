class Track {
  constructor(title, artist, ms, path) {
    (this.title = title),
      (this.artist = artist),
      (this.ms = ms),
      (this.path = path);
  }
}

const tracks = [
  new Track(
    "Battle Of The Creek",
    "Alexander Nakarada",
    166000,
    "/audio/battleOfTheCreek.mp3"
  ),
  new Track(
    "Breaking the siege",
    "Arthur Vyncke",
    246000,
    "/audio/breakingTheSiege.mp3"
  ),
  new Track(
    "Chasing Light",
    "Mattia Vlad Morleo",
    156000,
    "/audio/chasingLight.mp3"
  ),
  new Track(
    "Cobblestone Village",
    "Brandon Fiechter's Music",
    265000,
    "/audio/cobblestoneVillage.mp3"
  ),
  new Track("LANDS", "alexproductionsnocopyright", 177000, "/audio/lands.mp3"),
  new Track(
    "Medieval Town",
    "Brandon Fiechter's Music",
    167000,
    "/audio/medievalTown.mp3"
  ),
  new Track(
    "The Medieval Banquet",
    "Silvermansound",
    110000,
    "/audio/theMedievalBanquet.mp3"
  ),
  new Track(
    "Wild Boar's Inn",
    "Brandon Fiechter's Music",
    330000,
    "/audio/wildBoarsInn.mp3"
  ),
  new Track(
    "Nomadic Sunset",
    "Alexander Nakarada",
    201000,
    "/audio/nomadicSunset.mp3"
  ),
];

export default tracks;
