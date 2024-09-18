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
    if (
      timeOfTheDay === "nighttime" &&
      actionType === "execute" &&
      selectionRemaining()
    ) {
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
    if (
      (itsVillageVoteTime() ||
        wolfNightChoice() ||
        choosingPreyAsJuniorWolfAction() ||
        basicSelection()) &&
      !player.isUnderArrest
    )
      return "bg-slate-500 hover:bg-slate-400 cursor-pointer animate-pulse hover:animate-none";
  }
  return `bg-transparent`;
};

export const getPlyCardLayout = () => {
  return "w-full h-24 flex flex-col gap-2 justify-center items-center relative p-2";
};
