class Animation {
  constructor(title, ms, path) {
    (this.title = title), (this.ms = ms), (this.path = path);
  }
}

const animations = [
  new Animation("wolfHowl", 4000, "/animations/1726767910407.json"),
  new Animation("wolfWalking", 4000, "/animations/1726769814468.json"),
  new Animation("intoTheNight", 4000, "/animations/1726857462074.json"),
  new Animation("moon", 4000, "/animations/1726857466615.json"),
  new Animation("happySun", 4000, "/animations/1726857610320.json"),
];

export default animations;
