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
  new Animation("seerForesee", 3000, "/animations/seer_foresee.mp4", "video"),
  new Animation("serialKilling", 4000, "/animations/serial_killing.mp4", "video"),
  new Animation("theMayor", 6000, "/animations/the_mayor.mp4", "video"),
  new Animation("angryShooter", 6000, "/animations/angry_shooter.mp4", "video"),
  new Animation("arsonistPlay", 6000, "/animations/arsonist_play.mp4", "video"),
  new Animation("witchPoison", 6000, "/animations/witch_poison.mp4", "video"),
  new Animation("wolvesAte", 3000, "/animations/wolves_ate.mp4", "video"),
  new Animation("mediumRevive", 3000, "/animations/medium_revive.mp4", "video"),
  new Animation("loverSuicide", 4000, "/animations/lover_suicide.mp4", "video"),
  new Animation("jailerExecute", 5000, "/animations/jailer_execute.mp4", "video"),
];

export default animations;