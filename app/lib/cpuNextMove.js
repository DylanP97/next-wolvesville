const cpuNextMove = (
  cpu,
  dayCount,
  timeOfTheDay,
  playersList,
  socket,
  gameId
) => {
  // console.log("hello cpuNextMove");
  function getPlayerWithId(id) {
    return playersList.find((ply) => ply.id === id);
  }

  function getFool() {
    const fool = playersList.find((ply) => ply.role.name === 'Fool')
    return fool;
  }

  function getRandomAlivePlayer(
    excludeWerewolves = false,
    excludeRevealed = false,
    excludePlayerId = null // New parameter to exclude a specific player
  ) {
    let potentialPlayers = playersList.filter(
      (player) =>
        player.isAlive &&
        !player.isUnderArrest &&
        player.id !== excludePlayerId && // Exclude the specific player
        (!excludeWerewolves || player.role.team !== "Werewolves") &&
        (!excludeRevealed || !player.isRevealed)
    );
    if (potentialPlayers.length === 0) {
      return null;
    }
    let randomPlayer =
      potentialPlayers[Math.floor(Math.random() * potentialPlayers.length)];
    return randomPlayer;
  }

  function performNightAction() {
    switch (cpu.role.name) {
      case "Classic Werewolf":
      case "Alpha Werewolf":
        let target = getRandomAlivePlayer(true, false, null);
        const nbr = cpu.role.name === "Alpha Werewolf" ? 2 : 1;
        // ok console.log("wolftarget", target);
        if (target) {
          socket.emit(
            "addWolfVote",
            {
              playerId: cpu.id,
              playerName: cpu.name,
              selectedPlayerId: target.id,
              selectedPlayerName: target.name,
              nbr: nbr,
            },
            gameId
          );
        }
        break;
      case "Junior Werewolf":
        let juniorWolftarget = getRandomAlivePlayer(true, false, cpu.id);
        if (juniorWolftarget) {
          socket.emit(
            "chooseJuniorWolfDeathRevenge",
            {
              juniorWolfId: cpu.id,
              selectedPlayerId: juniorWolftarget.id,
            },
            gameId
          );
        }
        break;
      case "Witch":
        let witchTarget = getRandomAlivePlayer(false, false, cpu.id);
        if (witchTarget) {
          if (Math.random() < 0.5) {
            if (cpu.role.canPerform1.nbrLeftToPerform > 0) {
              socket.emit(
                "protectPotion",
                {
                  type: cpu.role.canPerform1.type,
                  playerId: cpu.id,
                  selectedPlayerId: witchTarget.id,
                  selectedPlayerName: witchTarget.name,
                },
                gameId
              );
            } else {
              console.log("no action remaining for witch");
            }
          } else {
            if (cpu.role.canPerform2.nbrLeftToPerform > 0) {
              socket.emit(
                "poisonPotion",
                {
                  type: cpu.role.canPerform2.type,
                  playerId: cpu.id,
                  selectedPlayerId: witchTarget.id,
                  selectedPlayerName: witchTarget.name,
                },
                gameId
              );
            } else {
              console.log("no action remaining for witch");
            }
          }
        }
        break;
      case "Serial Killer":
        let victim = getRandomAlivePlayer(false, false, cpu.id);
        if (victim) {
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
        }
        break;
      case "Cupid":
        if (dayCount === 0) {
          let lover1 = getRandomAlivePlayer();
          let lover2 = getRandomAlivePlayer();
          if (lover1 && lover2 && lover1.id !== lover2.id) {
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
        }
        break;
      case "Doctor":
        let playerToHeal = getRandomAlivePlayer();
        if (playerToHeal) {
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
        }
        break;
      case "Jailer":
        if (dayCount !== 0 && cpu.hasHandcuffed) {
          let handcuffedPlayerId = cpu.hasHandcuffed;
          let handcuffedPlayer = getPlayerWithId(handcuffedPlayerId);
          if (handcuffedPlayer) {
            console.log(
              "nombre d'exécutions restantes " +
              cpu.role.canPerform2.nbrLeftToPerform
            );
            if (cpu.role.canPerform2.nbrLeftToPerform > 0) {
              if (Math.random() < 0.5) {
                socket.emit(
                  "executePrisoner",
                  {
                    type: "execute",
                    playerId: cpu.id,
                    selectedPlayerId: handcuffedPlayerId,
                    selectedPlayerName: handcuffedPlayer.name,
                  },
                  gameId
                );
              }
            }
          }
        }
        break;
      // Add more roles as needed
      default:
        break;
    }
  }

  function performDayAction() {
    switch (cpu.role.name) {
      case "Mayor":
        if (Math.random() < 0.3 && cpu.role.canPerform1.nbrLeftToPerform > 0) {
          socket.emit("assertDuty", cpu.name, gameId);
        }
        break;
      case "Jailer":
        let arrestedPlayer = getRandomAlivePlayer(false, false, cpu.id);
        if (arrestedPlayer) {
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
        }
        break;
      case "Seer":
        let playerToReveal = getRandomAlivePlayer(false, true, cpu.id);
        if (playerToReveal && playerToReveal.id !== cpu.id) {
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
        }
        break;
      case "Shooter":
        let targetToShoot = getRandomAlivePlayer();
        if (targetToShoot) {
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
        }
        break;
      // Add more roles as needed
      default:
        break;
    }
  }

  function performVoteAction() {
    // let voteTarget = getRandomAlivePlayer();
    let voteTarget = getFool()
    if (voteTarget) {
      const nbr = cpu.role.name === "Mayor" && cpu.isRevealed ? 2 : 1;
      socket.emit(
        "addVote",
        {
          type: "addVote",
          playerId: cpu.id,
          playerName: cpu.name,
          selectedPlayerId: voteTarget.id,
          selectedPlayerName: voteTarget.name,
          nbr: nbr,
        },
        gameId
      );
    }
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
