const handleDoubleSelection = (
  player,
  clientPlayer,
  gameId,
  socket,
  actionType,
  selectedPlayers,
  selectionHelpers
) => {
  if (selectedPlayers.length === 0) {
    // First selection: just store the player
    selectionHelpers.addPlayer(player);
    return;
  }

  // Second selection – perform the action depending on type
  if (actionType === "link") {
    // Cupid: link two lovers
    // Prevent selecting the same player twice
    if (selectedPlayers[0].id === player.id) {
      return; // Don't allow linking a player to themselves
    }
    
    socket.emit(
      "registerAction",
      {
        type: "link",
        lover1Id: selectedPlayers[0].id,
        lover2Id: player.id,
        cupidId: clientPlayer.id,
      },
      gameId
    );
  }

  if (actionType === "pour") {
    // Arsonist: pour gasoline on TWO players in one go
    // Prevent selecting the same player twice
    if (selectedPlayers[0].id === player.id) {
      return; // Don't allow pouring gasoline on the same player twice
    }
    
    const firstTarget = selectedPlayers[0];
    const secondTarget = player;

    [firstTarget, secondTarget].forEach((target) => {
      socket.emit(
        "pourGasoline",
        {
          type: actionType,
          pyroId: clientPlayer.id,
          selectedPlayerId: target.id,
          selectedPlayerName: target.name,
        },
        gameId
      );
    });
  }

  // Mark the action as completed (blocks further use this night)
  selectionHelpers.complete(actionType);
};

export default handleDoubleSelection;