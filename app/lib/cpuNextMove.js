// here is the cpu logic

const cpuNextMove = (
  cpu,
  dayCount,
  timeOfTheDay,
  playersList,
  socket,
  gameId
) => {
  function getPlayerWithId(id) {
    return playersList.map((ply) => {
      if (ply.id === id) return ply;
    });
  }

  function getRandomAlivePlayer(excludeWerewolves = false) {
    let potentialPlayers = playersList.filter(
      (player) =>
        player.isAlive &&
        !player.isUnderArrest &&
        (!excludeWerewolves || player.role.team.join() !== "werewolves")
    );
    let randomPlayer =
      potentialPlayers[Math.floor(Math.random() * potentialPlayers.length)];
    return randomPlayer;
  }

  function performNightAction() {
    switch (cpu.role.name) {
      case "Classic Werewolf":
      case "Alpha Werewolf":
        let target = getRandomAlivePlayer(true);
        socket.emit(
          "addWolfVote",
          target.id,
          cpu.role.name === "Alpha Werewolf" ? 2 : 1,
          gameId
        );
        break;
      case "Serial Killer":
        let victim = getRandomAlivePlayer();
        socket.emit(
          "registerAction",
          {
            type: "murder",
            killerId: cpu.id,
            selectedPlayerId: victim.id,
            selectedPlayerName: victim.name,
          },
          gameId
        );
        break;
      case "Cupid":
        if (dayCount === 0) {
          let lover1 = getRandomAlivePlayer();
          let lover2 = getRandomAlivePlayer();
          socket.emit(
            "registerAction",
            {
              type: "link",
              lover1Id: lover1.id,
              lover2Id: lover2.id,
              cupidId: cpu.id,
            },
            gameId
          );
        }
        break;
      case "Doctor":
        let playerToHeal = getRandomAlivePlayer();
        socket.emit(
          "heal",
          {
            type: "heal",
            playerId: cpu.id,
            selectedPlayerId: playerToHeal.id,
            selectedPlayerName: playerToHeal.name,
          },
          gameId
        );
        break;
      case "Jailer":
        if (!dayCount === 0) {
          let handcuffedPlayerId = cpu.hasHandcuffed;
          socket.emit(
            "executePrisoner",
            {
              type: "execute",
              playerId: cpu.id,
              selectedPlayerId: handcuffedPlayerId,
              selectedPlayerName: getPlayerWithId(handcuffedPlayerId),
            },
            gameId
          );
        }
        break;
      // Add more roles as needed
      default:
        break;
    }
  }

  function performDayAction() {
    switch (cpu.role.name) {
      case "Jailer":
        let arrestedPlayer = getRandomAlivePlayer();
        socket.emit(
          "registerAction",
          {
            type: "arrest",
            playerId: cpu.id,
            selectedPlayerId: arrestedPlayer.id,
            selectedPlayerName: arrestedPlayer.name,
          },
          gameId
        );
        break;
      case "Seer":
        let playerToReveal = getRandomAlivePlayer();
        socket.emit(
          "revealPlayer",
          {
            type: "reveal",
            seerId: cpu.id,
            selectedPlayerId: playerToReveal.id,
            selectedPlayerName: playerToReveal.name,
          },
          gameId
        );
        break;
      case "Shooter":
        let targetToShoot = getRandomAlivePlayer();
        socket.emit(
          "shootBullet",
          {
            type: "shoot",
            gunnerId: cpu.id,
            selectedPlayerId: targetToShoot.id,
            selectedPlayerName: targetToShoot.name,
          },
          gameId
        );
        break;
      // Add more roles as needed
      default:
        break;
    }
  }

  function performVoteAction() {
    let voteTarget = getRandomAlivePlayer();
    socket.emit("addVote", voteTarget.id, 1, gameId);
  }

  if (timeOfTheDay === "nighttime") {
    performNightAction();
  } else if (timeOfTheDay === "daytime") {
    performDayAction();
  } else if (timeOfTheDay === "votetime") {
    performVoteAction();
  }
};

export default cpuNextMove;
