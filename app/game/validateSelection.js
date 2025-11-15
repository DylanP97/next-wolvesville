
const validateSelection = (player, clientPlayer, actionType, timeOfTheDay) => {
  const isJailer = clientPlayer.role.name === "Jailer";
  const isGraveRobber = clientPlayer.role.name === "Grave Robber";

  // Can't select yourself
  if (player.id === clientPlayer.id) {
    return { valid: false, errorCode: "errorMessage.0001" };
  }

  // Dead player checks
  if (!player.isAlive) {
    if (isGraveRobber && actionType === "loot") {
      return { valid: true }; // Grave Robber can loot dead
    }
    return { valid: false, errorCode: "errorMessage.0002", animation: "loomingGrave" };
  }

  // Grave Robber can't loot alive players
  if (isGraveRobber && actionType === "loot") {
    return { valid: false, errorCode: "errorMessage.0003" };
  }

  // Jail checks
  if (!isJailer && player.isUnderArrest) {
    return { valid: false, errorCode: "errorMessage.0004" };
  }

  if (isJailer && actionType === "execute" && !player.isUnderArrest) {
    return { valid: false, errorCode: "errorMessage.0005" };
  }

  // Wolf-specific checks
  if (actionType === "wolfVote" && player.role.team === "Werewolves") {
    return { valid: false, errorCode: "errorMessage.0007" };
  }

  if (actionType === "uncoverRole") {
    if (player.role.team === "Werewolves") {
      return { valid: false, errorCode: "errorMessage.0007" };
    }
    if (player.isRevealed) {
      return { valid: false, errorCode: "errorMessage.0008" };
    }
  }

  // Reveal check
  if (actionType === "reveal" && player.isRevealed) {
    return { valid: false, errorCode: "errorMessage.0008" };
  }

  // Junior Wolf check
  if (actionType === "chooseJuniorWolfDeathRevenge" && player.role.team === "Werewolves") {
    return { valid: false, errorCode: "errorMessage.0006" };
  }

  return { valid: true };
};

export default validateSelection;   