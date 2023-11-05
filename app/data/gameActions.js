export const killSelectedPlayer = (
  playerIdToKill,
  setUpdatedPlayersList
) => {
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

export const killRandomPlayer = (playerId, setUpdatedPlayersList) => {
  const randomKilledIndex = Math.round(
    Math.random() * 10
  );
  setUpdatedPlayersList((prevPlayersList) => {
    return prevPlayersList.map((player) => {
      if (player.id === playerId) {
        return {
          ...player,
          isAlive: false,
        };
      }
      return player;
    });
  });
};
