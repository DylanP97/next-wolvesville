class Animation {
  constructor(title, ms, path) {
    (this.title = title), (this.ms = ms), (this.path = path);
  }
}

const animations = [
  new Animation("wolfHowl", 3000, "/animations/1726767910407.json"),
  new Animation("wolfWalking", 3000, "/animations/1726769814468.json"),
  new Animation("intoTheNight", 3000, "/animations/1726857462074.json"),
  new Animation("moon", 3000, "/animations/1726857466615.json"),
  new Animation("happySun", 3000, "/animations/1726857610320.json"),
  new Animation("deadStuck", 1000, "/animations/1728039673722.json"),
  new Animation("loomingGrave", 1000, "/animations/1728040347241.json"),
];

export default animations;
