import characters from "./characters";
import { shortName } from "@/app/lib/randomUsername";
import initialPlayersList from "./playerListTemplate";

export const assignRolesToPlayers = (excludedRoles = []) => {
  const assignedRoles = new Set();

  const randomRoles = initialPlayersList.map((player, index) => {
    let randomCharacter;
    do {
      randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    } while (assignedRoles.has(randomCharacter.name) || excludedRoles.includes(randomCharacter.name));
    assignedRoles.add(randomCharacter.name);
    let randomName;
    randomName = shortName();
    return {
      ...player,
      name: randomName,
      role: randomCharacter,
    };
  });

  return randomRoles;
};

export const getPlayerById = (playerId, updatedPlayersList) => {
  return updatedPlayersList.find((player) => player.id === playerId);
};

export const killSelectedPlayer = (playerIdToKill, setUpdatedPlayersList) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === playerIdToKill) {
        return {
          ...player,
          isAlive: false,
        };
      }
      return player;
    });
  });
};

export const killRandomPlayer = (setUpdatedPlayersList, displayAction, isTerrorist) => {
  const randomKilledIndex = Math.floor(Math.random() * 12);
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === randomKilledIndex) {
        if (player.isAlive) {
          isTerrorist && displayAction(`A sudden terrorist explosion killed ${player.name}!`);
          return {
            ...player,
            isAlive: false,
          };
        } else {
          // The player is already dead, do nothing
          return player;
        }
      }
      return player;
    });
  });
};

export const voteAgainst = (playerId, setUpdatedPlayersList) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === playerId) {
        return {
          ...player,
          voteAgainst: player.voteAgainst + 1,
        };
      }
      return player;
    });
  });
};

export const doubleVoteAgainst = (playerId, setUpdatedPlayersList) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === playerId) {
        return {
          ...player,
          voteAgainst: player.voteAgainst + 2,
        };
      }
      return player;
    });
  });
};

export const findPlayerWithMostVotes = (playersList) => {
  let playerWithMostVotes = null;
  let maxVotes = 0;

  for (const player of playersList) {
    if (player.voteAgainst > maxVotes) {
      maxVotes = player.voteAgainst;
      playerWithMostVotes = player;
    }
  }

  return playerWithMostVotes;
};

export const cleanUpRegisteredActionsConcerningDeadPlayers = (updatedPlayersList, setRegisteredActions) => {
  // if player is dead clean all his registered actions
  updatedPlayersList.forEach((player) => {
    if (!player.isAlive) {
      setRegisteredActions((registeredActionsList) => {
        return registeredActionsList.filter((action) => {
          action.playerId !== player.id && action.selectedPlayer.id !== player.id;
        });
      });
    }
  });
};

export const aftermathOfVote = (displayAction, updatedPlayersList, setUpdatedPlayersList, setWinner) => {
  const mostVotedAgainstPlayer = findPlayerWithMostVotes(updatedPlayersList);

  // reset every player nbrOfVotes to 0
  updatedPlayersList.forEach((player) => {
    player.voteAgainst = 0;
  });

  if (!mostVotedAgainstPlayer) {
    displayAction(`The town couldn't decide who to kill!`);
  } else {
    killSelectedPlayer(mostVotedAgainstPlayer.id, setUpdatedPlayersList);
    if (mostVotedAgainstPlayer.role.name === "Fool") {
      displayAction(`The fool won 🤡!`);
      setWinner(mostVotedAgainstPlayer);
    } else {
      displayAction(
        `The town decided to kill ${updatedPlayersList[mostVotedAgainstPlayer.id].name} has a result of the vote!`
      );
      checkIfIsInLove(mostVotedAgainstPlayer, updatedPlayersList, setUpdatedPlayersList, displayAction);
    }
  }
};

export const shootBullet = (action, updatedPlayersList, setUpdatedPlayersList, displayAction) => {
  killSelectedPlayer(action.selectedPlayer.id, setUpdatedPlayersList);
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.player) {
        return {
          ...player,
          role: {
            ...player.role,
            canPerform: {
              ...player.role.canPerform,
              nbrLeftToPerform: player.role.canPerform.nbrLeftToPerform - 1,
            },
          },
        };
      }
      return player;
    });
  });
  displayAction(`The shooter has shot ${updatedPlayersList[action.selectedPlayer.id].name}!`);
  checkIfIsInLove(action.selectedPlayer, updatedPlayersList, setUpdatedPlayersList, displayAction);
};

export const arrestPlayer = (action, updatedPlayersList, setUpdatedPlayersList, displayAction) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.selectedPlayer.id) {
        return {
          ...player,
          isUnderArrest: true,
        };
      }
      return player;
    });
  });
  displayAction(`The sheriff has handcuffed ${updatedPlayersList[action.selectedPlayer.id].name}!`);
};

export const releasePrisoners = (setUpdatedPlayersList) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.isUnderArrest) {
        return {
          ...player,
          isUnderArrest: false,
        };
      }
      return player;
    });
  });
};

export const revealPlayer = (action, updatedPlayersList, setUpdatedPlayersList, displayAction) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.selectedPlayer.id) {
        return {
          ...player,
          isRevealed: true,
        };
      }
      if (player.id === action.player.id) {
        return {
          ...player,
          role: {
            ...role,
            canPerform: {
              ...canPerform,
              nbrLeftToPerform: player.role.canPerform.nbrLeftToPerform - 1,
            },
          },
        };
      }
      return player;
    });
  });
  displayAction(
    `The seer's magical crystal ball unveiled the identity of ${updatedPlayersList[action.selectedPlayer.id].name}!`
  );
};

export const checkIfIsInLove = (player, updatedPlayersList, setUpdatedPlayersList, displayAction) => {
  if (player.isInLove) {
    const lovers = findLovers(updatedPlayersList);
    const partner = lovers.find((partner) => partner.id !== player.id);
    killSelectedPlayer(partner.id, setUpdatedPlayersList);
    displayAction(`${partner.name} is dead because of its loving relation with ${player.name}!`);
  } else {
    return;
  }
};

export const findLovers = (updatedPlayersList) => {
  const lovers = updatedPlayersList.filter((player) => player.isInLove);
  return lovers;
};

export const linkLovers = (action, setUpdatedPlayersList) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.selectedPlayer) {
        return {
          ...player,
          isInLove: true,
        };
      }
      if (player.id === action.player) {
        return {
          ...player,
          role: {
            ...player.role,
            canPerform: {
              ...player.role.canPerform,
              nbrLeftToPerform: 0,
            },
          },
        };
      }
      return player;
    });
  });
};

export const murder = (action, updatedPlayersList, setUpdatedPlayersList, displayAction) => {
  const selectedPlayer = getPlayerById(action.selectedPlayer.id, updatedPlayersList);
  const wasHealed = checkIfWasHealed(selectedPlayer, setUpdatedPlayersList);
  if (!wasHealed) {
    killSelectedPlayer(selectedPlayer.id, setUpdatedPlayersList);
    displayAction(`A serial killer killed ${updatedPlayersList[selectedPlayer.id].name} last night...`);
    checkIfIsInLove(selectedPlayer, updatedPlayersList, setUpdatedPlayersList, displayAction);
  } else {
    displayAction("Someone wounds were healed by the doctor tonight!");
  }
};

export const checkIfWasHealed = (attackedPlayer, setUpdatedPlayersList) => {
  const wasHealed = attackedPlayer.isHealed;
  if (wasHealed) {
    setUpdatedPlayersList((prevPlayersList) => {
      return prevPlayersList.map((player) => {
        if (player.id === attackedPlayer.id) {
          return {
            ...player,
            isHealed: false,
          };
        }
        return player;
      });
    });
    return true;
  } else {
    return;
  }
};

export const heal = (action, setUpdatedPlayersList) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.selectedPlayer.id) {
        return {
          ...player,
          isHealed: true,
        };
      }
      return player;
    });
  });
};

export const investigatePlayers = (
  setInvestigatedPlayers,
  setInvestigationResult,
  setDisplayInvestigation,
  setIsDoubleSelection,
  toNext,
  otherSelectedPlayer,
  otherSelected2Player,
  displayAction
) => {
  setInvestigatedPlayers([otherSelectedPlayer.id, otherSelected2Player.id]);
  const isDifferentTeam = otherSelectedPlayer.role.team !== otherSelected2Player.role.team;
  setInvestigationResult(isDifferentTeam ? "different" : "same");
  setDisplayInvestigation(true);
  displayAction(
    `${otherSelectedPlayer.name} and ${otherSelected2Player.name} are ${
      isDifferentTeam ? "from different teams" : "from the same team"
    }!`
  );
  setTimeout(() => {
    setDisplayInvestigation(false);
    setIsDoubleSelection(false);
    toNext();
  }, 3000);
};

export const pourGasoline = (action, setUpdatedPlayersList) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.player) {
        return {
          ...player,
          role: {
            ...player.role,
            playersToSetOnFire: [...player.role.playersToSetOnFire, action.selectedPlayer],
          },
        };
      }
      return player;
    });
  });
};

export const burnPlayers = (playersToSetOnFire, setUpdatedPlayersList, displayAction, toNext) => {
  playersToSetOnFire.map((player) => {
    killSelectedPlayer(player.id, setUpdatedPlayersList);
    displayAction(`A malicious fire burned ${player.name}!`);
  });
  toNext();
};

export const muteVoter = (action, setUpdatedPlayersList) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.selectedPlayer.id) {
        return {
          ...player,
          role: {
            ...player.role,
            canVote: false,
          },
        };
      }
      return player;
    });
  });
};

export const unmuteVoter = (action, setUpdatedPlayersList) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.selectedPlayer.id) {
        return {
          ...player,
          role: {
            ...player.role,
            canVote: true,
          },
        };
      }
      return player;
    });
  });
};

export const craftTheBomb = (action, setUpdatedPlayersList) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.player) {
        return {
          ...player,
          role: {
            ...player.role,
            canPerform: {
              ...player.role.canPerform,
              nbrLeftToPerform: player.role.canPerform.nbrLeftToPerform - 1,
            },
            bombPower: player.role.bombPower + 1,
          },
        };
      }
      return player;
    });
  });
};

export const explodeBomb = (bombPower, setUpdatedPlayersList, displayAction, toNext) => {
  const isTerrorist = true;
  for (let e = 0; e < bombPower; e++) {
    killRandomPlayer(setUpdatedPlayersList, displayAction, isTerrorist);
  }
  toNext();
};

export const robTheRole = (action, setUpdatedPlayersList, displayAction) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.player) {
        return {
          ...player,
          role: action.selectedPlayer.role,
        };
      }
      return player;
    });
  });
  displayAction("A grave was looted last night...");
};

export const becomeAccomplice = (playerToPlay, selectedAccomplice, setUpdatedPlayersList, toNext) => {
  const accompliceObject = characters.find((c) => c.name === "Accomplice");
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === selectedAccomplice.id) {
        return {
          ...player,
          role: accompliceObject,
        };
      } else if (player.id === playerToPlay.id) {
        return {
          ...player,
          role: {
            ...player.role,
            partner: true,
          },
        };
      }
      return player;
    });
  });
  toNext();
};

export const eliminate = (action, updatedPlayersList, setUpdatedPlayersList, displayAction) => {
  const selectedPlayer = getPlayerById(action.selectedPlayer.id, updatedPlayersList);
  const wasHealed = checkIfWasHealed(selectedPlayer, setUpdatedPlayersList);
  if (!wasHealed) {
    killSelectedPlayer(selectedPlayer.id, setUpdatedPlayersList);
    displayAction(`A bandit killed ${updatedPlayersList[selectedPlayer.id].name} last night...`);
    checkIfIsInLove(selectedPlayer, updatedPlayersList, setUpdatedPlayersList, displayAction);
  } else {
    displayAction("Someone wounds were healed by the doctor tonight!");
  }
};
