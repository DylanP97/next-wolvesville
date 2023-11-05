
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
        if (player.voteAgainst === undefined) {
          return {
            ...player,
            voteAgainst: 0,
          };
        } else {
          return {
            ...player,
            voteAgainst: player.voteAgainst + 1,
          };
        }
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
}
