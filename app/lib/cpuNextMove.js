// here is the cpu logic

const cpuNextMove = (
  cpuId,
  cpuName,
  cpuRole,
  dayCount,
  timeOfTheDay,
  playersList,
  socket,
  gameId
) => {
  if (timeOfTheDay == "nighttime" && cpuRole.team.join() === "werewolves") {
    console.log(cpuId, cpuName);

    function RandomOpponentToSelect() {
      let randomSelectedPlayerId;
      let potentialsPlyrsToSelct = [];

      playersList.map((player) => {
        if (
          player.isAlive &&
          !player.isUnderArrest &&
          player.role.team.join() !== "werewolves"
        ) {
          potentialsPlyrsToSelct.push(player.id);
        }
      });

      randomSelectedPlayerId =
        potentialsPlyrsToSelct[
          Math.floor(Math.random() * potentialsPlyrsToSelct.length)
        ];

      return randomSelectedPlayerId;
    }

    socket.emit(
      "addWolfVote",
      RandomOpponentToSelect(),
      cpuRole.name === "Alpha Werewolf" ? 2 : 1,
      gameId
    );
  }
};

export default cpuNextMove;
