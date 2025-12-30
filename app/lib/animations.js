class Animation {
  constructor(title, ms, path, type = "lottie") {
    this.title = title;
    this.ms = ms;
    this.path = path;
    this.type = type; // "lottie" or "video"
  }
}

const animations = [
  // Lottie animations
  new Animation("wolfHowl", 1500, "/animations/1726767910407.json", "lottie"),
  new Animation("wolfWalking", 1500, "/animations/1726769814468.json", "lottie"),
  new Animation("intoTheNight", 1500, "/animations/1726857462074.json", "lottie"),
  new Animation("moon", 1500, "/animations/1726857466615.json", "lottie"),
  new Animation("happySun", 1500, "/animations/1726857610320.json", "lottie"),
  new Animation("deadStuck", 1500, "/animations/1728039673722.json", "lottie"),
  new Animation("loomingGrave", 1500, "/animations/1728040347241.json", "lottie"),

  // Video animations
  new Animation("graveRobber", 6000, "/animations/grave_robber.mp4", "video"),
  new Animation("seerForesee", 6000, "/animations/seer_foresee.mp4", "video"),
  new Animation("serialKilling", 6000, "/animations/serial_killing.mp4", "video"),
  new Animation("theMayor", 6000, "/animations/the_mayor.mp4", "video"),
  new Animation("angryShooter", 6000, "/animations/angry_shooter.mp4", "video"),
];

export default animations;