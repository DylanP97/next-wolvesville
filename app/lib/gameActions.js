
import characters from "./characters";
import { shortName } from "@/app/lib/randomUsername";
import initialPlayersList from "./playerListTemplate";

export const assignRolesToPlayers = () => {
  const assignedRoles = new Set();

  const randomRoles = initialPlayersList.map((player, index) => {
    let randomCharacter;
    do {
      randomCharacter =
        characters[Math.floor(Math.random() * characters.length)];
    } while (assignedRoles.has(randomCharacter.name));
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

export const killRandomPlayer = (setUpdatedPlayersList) => {
  const randomKilledIndex = Math.round(Math.random() * 10);
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === randomKilledIndex) {
        return {
          ...player,
          isAlive: false,
        };
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

export const aftermathOfVote = (
  displayAction,
  updatedPlayersList,
  setUpdatedPlayersList
) => {
  const mostVotedAgainstPlayer = findPlayerWithMostVotes(updatedPlayersList);
  if (!mostVotedAgainstPlayer) {
    displayAction(`The town couldn't decide who to kill!`);
  } else {
    killSelectedPlayer(mostVotedAgainstPlayer.id, setUpdatedPlayersList);
    displayAction(
      `The town decided to kill ${
        updatedPlayersList[mostVotedAgainstPlayer.id].name
      } has a result of the vote!`
    );
  }
};

export const shootBullet = (
  action,
  updatedPlayersList,
  setUpdatedPlayersList,
  displayAction
) => {
  killSelectedPlayer(action.selectedPlayerId, setUpdatedPlayersList);
  displayAction(
    `The shooter has shot ${
      updatedPlayersList[action.selectedPlayerId].name
    } this night !`
  );
};

export const arrestPlayer = (
  action,
  updatedPlayersList,
  setUpdatedPlayersList,
  displayAction
) => {
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === action.selectedPlayerId) {
        return {
          ...player,
          isUnderArrest: true,
        };
      }
      return player;
    });
  });
  displayAction(
    `The sheriff has handcuffed ${
      updatedPlayersList[action.selectedPlayerId].name
    }!`
  );
};

export const cleanUpRegisteredActionsConcerningDeadPlayers = (
  updatedPlayersList,
  setRegisteredActions
) => {
  // if player is dead clean all his registered actions
  updatedPlayersList.forEach((player) => {
    if (!player.isAlive) {
      setRegisteredActions((registeredActionsList) => {
        return registeredActionsList.filter((action) => {
          action.playerId !== player.id &&
            action.selectedPlayerId !== player.id;
        });
      });
    }
  });
};
