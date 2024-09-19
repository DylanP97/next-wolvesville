class Animation {
  constructor(title, ms, path) {
    (this.title = title), (this.ms = ms), (this.path = path);
  }
}

const animations = [
  new Animation("wolfHowl", 4000, "/animations/1726767910407.json"),
];

export default animations;
