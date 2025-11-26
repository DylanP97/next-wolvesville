// styles for the player card

export const getPlyCardBackground = (
  player,
  selectedPlayer,
  selectedPlayer1,
  isAlsoWolf,
  timeOfTheDay,
  clientPlayer,
  isWolf,
  isSelection,
  isDoubleSelection,
  isBlocked,
  weather,
  actionType
) => {

  const isGraveRobber = clientPlayer.role.name === "Grave Robber";

  // Grave Robber looting dead players
  if (isGraveRobber && actionType === "loot" && !player.isAlive) {
    return "bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 cursor-pointer animate-pulse hover:animate-none shadow-md hover:shadow-lg transition-all";
  }

  // if player is dead, return black with fade
  if (!player.isAlive) return "bg-black text-yellow-500 border-yellow-600 opacity-20 grayscale cursor-not-allowed";

  // Grave Robber can't loot dead players
  if (isGraveRobber && actionType === "loot" && player.isAlive) {
    return "bg-transparent opacity-20 grayscale cursor-not-allowed";
  }

  // if player is user, return slate
  if (clientPlayer.id === player.id)
    return "bg-gradient-to-br from-blue-500 to-slate-600 border-red-500 border-2 text-white shadow-md";

  if (selectedPlayer) {
    if (player.id === selectedPlayer) return "bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-500/50";
  }

  if (selectedPlayer1) {
    if (player.id === selectedPlayer1) return "bg-gradient-to-br from-green-600 to-green-700 shadow-lg shadow-green-500/50";
  }

  function selectionRemaining() {
    return (
      (isSelection ||
        (isDoubleSelection &&
          player.id !== (selectedPlayer1 && selectedPlayer1.id))) &&
      !isBlocked
    );
  }

  if (clientPlayer.role.name === "Jailer") {
    if (
      timeOfTheDay === "nighttime" &&
      actionType === "execute" &&
      selectionRemaining()
    ) {
      if (player.isUnderArrest) {
        return "bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 cursor-pointer animate-pulse hover:animate-none shadow-md hover:shadow-lg transition-all";
      } else {
        return `${weather}`;
      }
    }
  }

  function choosingPreyAsJuniorWolfAction() {
    return (
      !isAlsoWolf &&
      clientPlayer.role.name === "Junior Werewolf" &&
      actionType === "chooseJuniorWolfDeathRevenge"
    );
  }

  function wolfNightChoice() {
    return isWolf && timeOfTheDay === "nighttime" && actionType === "wolfVote";
  }

  function itsVillageVoteTime() {
    return clientPlayer.role.canVote && timeOfTheDay === "votetime";
  }

  function wolfSeerSelection() {
    return (
      clientPlayer.role.name === "Wolf Seer" &&
      actionType === "uncoverRole" &&
      timeOfTheDay === "nighttime"
    );
  }

  function basicSelection() {
    return (
      !itsVillageVoteTime() &&
      !wolfNightChoice() &&
      !choosingPreyAsJuniorWolfAction() &&
      !wolfSeerSelection() &&
      ((timeOfTheDay === "daytime" &&
        clientPlayer.role.canPerform1 &&
        clientPlayer.role.canPerform1.actionTime === "day") ||
        (timeOfTheDay === "daytime" &&
          clientPlayer.role.canPerform2 &&
          clientPlayer.role.canPerform2.actionTime === "day") ||
        (timeOfTheDay === "nighttime" &&
          clientPlayer.role.canPerform1 &&
          clientPlayer.role.canPerform1.actionTime === "night") ||
        (timeOfTheDay === "nighttime" &&
          clientPlayer.role.canPerform2 &&
          clientPlayer.role.canPerform2.actionTime === "night"))
    );
  }

  // cases when to display the card as a potentially selected item
  if (selectionRemaining()) {
    // Wolf Seer specific selection logic
    if (wolfSeerSelection() && !player.isUnderArrest) {
      // Check if player is selectable by Wolf Seer
      if (player.role.team === "Werewolves" || player.isRevealed) {
        // Non-selectable players: other wolves and already revealed players
        return "cursor-not-allowed opacity-40 grayscale";
      } else {
        // Selectable players: non-wolves and non-revealed players
        return "bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 cursor-pointer animate-pulse hover:animate-none shadow-md hover:shadow-lg transition-all";
      }
    }
    
    // Wolf vote selection logic
    if (wolfNightChoice() && !player.isUnderArrest) {
      if (player.role.team === "Werewolves") {
        // Non-selectable players: other wolves
        return "cursor-not-allowed opacity-80 grayscale";
      } else {
        // Selectable players: non-wolves
        return "bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 cursor-pointer animate-pulse hover:animate-none shadow-md hover:shadow-lg transition-all";
      }
    }
    
    // Junior Wolf revenge selection logic
    if (choosingPreyAsJuniorWolfAction() && !player.isUnderArrest) {
      if (player.role.team === "Werewolves") {
        // Non-selectable players: other wolves
        return "cursor-not-allowed opacity-40 grayscale";
      } else {
        // Selectable players: non-wolves
        return "bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 cursor-pointer animate-pulse hover:animate-none shadow-md hover:shadow-lg transition-all";
      }
    }
    
    // General selection logic for other cases
    if (
      (itsVillageVoteTime() || basicSelection()) &&
      !player.isUnderArrest
    )
      return "bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 cursor-pointer animate-pulse hover:animate-none shadow-md hover:shadow-lg transition-all";
  }
  return `bg-transparent`;
};

export const getPlyCardLayout = () => {
  return "w-full h-28 flex flex-col gap-1 justify-center items-center relative p-3 rounded-lg border border-gray-700 transition-all duration-200 hover:shadow-lg";
};
