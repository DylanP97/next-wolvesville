const cpuLogic = (cpuId, cpuName, cpuRole, timeOfTheDay, socket) => {
  if (timeOfTheDay == "nighttime" && cpuRole == "Classic Werewolf") {
    console.log(cpuId, " ", cpuName);

    socket.emit("addWolfVote", 
    selectedPlayer.id, // need to pick random index of an alive player
    nbr, 
    gameId
  );
  }
};

export default cpuLogic;
