const handleDoubleSelection = (player, clientPlayer, gameId, socket, actionType, selectedPlayers, selectionHelpers) => {
    if (selectedPlayers.length === 0) {
        // First selection
        selectionHelpers.addPlayer(player);
    } else {
        // Second selection - execute action
        if (actionType === "link") {
            socket.emit("registerAction", {
                type: "link",
                lover1Id: selectedPlayers[0].id,
                lover2Id: player.id,
                cupidId: clientPlayer.id,
            }, gameId);
        }

        selectionHelpers.complete(actionType);
    }
};

export default handleDoubleSelection;