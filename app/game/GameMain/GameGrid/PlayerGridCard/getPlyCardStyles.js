// styles for the player card

const getPlyCardStyles = (
  player,
  clientPlayer,
  isSelection,
  isDoubleSelection,
  selectedPlayer,
  selectedPlayer1,
  isBlocked,
  isWolf,
  isAlsoWolf,
  actionType,
  weather,
  timeOfTheDay
) => {
  // if player is dead, return black
  if (!player.isAlive) return "bg-black text-yellow-500";

  // if player is user, return slate
  if (clientPlayer.id === player.id)
    return "bg-slate-400 border-red-500 border-2 text-black";

  if (selectedPlayer) {
    if (player.id === selectedPlayer.id) return "bg-red-500";
  }

  if (selectedPlayer1) {
    if (player.id === selectedPlayer1.id) return "bg-green-500";
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
    if (timeOfTheDay === "nighttime" && actionType === "execute") {
      if (player.isUnderArrest) {
        return "bg-slate-500 hover:bg-slate-400 cursor-pointer animate-pulse hover:animate-none";
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
    return isWolf && !isAlsoWolf && timeOfTheDay === "nighttime";
  }

  function itsVillageVoteTime() {
    return clientPlayer.role.canVote && timeOfTheDay === "votetime";
  }

  function basicSelection() {
    return (
      !itsVillageVoteTime() &&
      !wolfNightChoice() &&
      !choosingPreyAsJuniorWolfAction() &&
      ((timeOfTheDay === "daytime" &&
        clientPlayer.role.canPerform.actionTime === "day") ||
        (timeOfTheDay === "daytime" &&
          clientPlayer.role.canPerform2.actionTime === "day") ||
        (timeOfTheDay === "nighttime" &&
          clientPlayer.role.canPerform.actionTime === "night") ||
        (timeOfTheDay === "nighttime" &&
          clientPlayer.role.canPerform2.actionTime === "night"))
    );
  }

  // cases when to display the card as a potentially selected item
  if (selectionRemaining()) {
    if (
      itsVillageVoteTime() ||
      wolfNightChoice() ||
      choosingPreyAsJuniorWolfAction() ||
      basicSelection()
    )
      return "bg-slate-500 hover:bg-slate-400 cursor-pointer animate-pulse hover:animate-none";
  }
  return `bg-transparent`;
};

export default getPlyCardStyles;
