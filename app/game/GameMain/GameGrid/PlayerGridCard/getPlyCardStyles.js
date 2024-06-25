// styles for the player card

const getPlyCardStyles = (
  player,
  clientPlayer,
  isSelection,
  isDoubleSelection,
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

  function selectionRemaining() {
    return (
      (isSelection ||
        (isDoubleSelection &&
          player.id !== (selectedPlayer1 && selectedPlayer1.id))) &&
      !isBlocked
    );
  }

  // if client player is a junior wolf and the selection is for its action, he can choose another player that is not a wolf at anytime of the day
  function chooseJuniorWolfDeathRevenge() {
    return (
      !isAlsoWolf &&
      clientPlayer.role.name === "Junior Werewolf" &&
      actionType === "chooseJuniorWolfDeathRevenge"
    );
  }

  // if client player is a wolf and he's choosing who to vote against at night
  function wolfNightChoice() {
    return isWolf && !isAlsoWolf && timeOfTheDay === "nighttime";
  }

  // but if player is under arrest and the client is the jailer, the client can select him to execute him
  function toBeExecuted() {
    return (
      clientPlayer.role.name === "Jailer" &&
      player.isUnderArrest &&
      timeOfTheDay === "nighttime"
    );
  }

  function isAFreeCitizen() {
    return !player.isUnderArrest;
  }

  function arrestPrisoner() {
    return (
      clientPlayer.role.name === "Jailer" &&
      timeOfTheDay === "daytime" &&
      actionType === "arrest"
    );
  }

  function itsVillageVoteTime() {
    return clientPlayer.canVote && timeOfTheDay === "votetime";
  }

  // cases when to display the card as a potentially selected item
  if (
    selectionRemaining() &&
    (itsVillageVoteTime() ||
      (isAFreeCitizen() &&
        (arrestPrisoner() ||
          chooseJuniorWolfDeathRevenge() ||
          wolfNightChoice())) ||
      toBeExecuted())
  )
    return "bg-red-800 cursor-pointer animate-pulse";

  return `${weather}`;
};

export default getPlyCardStyles;
