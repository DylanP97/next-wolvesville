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
  new Animation("graveRobber", 6000, "/animations/grave_robber.webm", "video"),
  new Animation("seerForesee", 3000, "/animations/seer_foresee.webm", "video"),
  new Animation("serialKilling", 4000, "/animations/serial_killing.webm", "video"),
  new Animation("theCaptain", 6000, "/animations/the_captain.webm", "video"),
  new Animation("angryShooter", 6000, "/animations/angry_shooter.webm", "video"),
  new Animation("arsonistPlay", 6000, "/animations/arsonist_play.webm", "video"),
  new Animation("witchPoison", 6000, "/animations/witch_poison.webm", "video"),
  new Animation("wolvesAte", 3000, "/animations/wolves_ate.webm", "video"),
  new Animation("mediumRevive", 3000, "/animations/medium_revive.webm", "video"),
  new Animation("loverSuicide", 4000, "/animations/lover_suicide.webm", "video"),
  new Animation("jailerExecute", 5000, "/animations/jailer_execute.webm", "video"),
];

export default animations;