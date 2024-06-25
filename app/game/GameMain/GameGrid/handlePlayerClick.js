// handlePlayerClick.js

const handlePlayerClick = (
  actionType,
  clientPlayer,
  gameId,
  isJailer,
  socket,
  timeOfTheDay,
  isBlocked,
  isSelection,
  isDoubleSelection,
  setIsBlocked,
  setIsSelection,
  setIsDoubleSelection,
  selectedPlayer,
  selectedPlayer1,
  setSelectedPlayer1
) => {
  function selectionCompleted() {
    setIsBlocked(true);
    setIsSelection(false);
  }

  function doubleSelectionCompleted() {
    setIsBlocked(true);
    setIsDoubleSelection(false);
  }

  if (!isBlocked) {
    if (isSelection || isDoubleSelection) {
      if (selectedPlayer.id === clientPlayer.id) {
        console.log("Don't select yourself!");
        return;
      }

      if (!selectedPlayer.isAlive) {
        console.log("This player is dead. Stop hitting its grave.");
        return;
      }

      if (!isJailer && selectedPlayer.isUnderArrest) {
        console.log("this player is locked up in jail. You can't select him.");
        return;
      }

      if (
        isJailer &&
        actionType === "execute" &&
        !selectedPlayer.isUnderArrest
      ) {
        console.log("You can only execute the player who is under arrest.");
        return;
      }

      if (timeOfTheDay === "votetime" && actionType === "vote") {
        const nbr =
          clientPlayer.role.name === "Mayor" && clientPlayer.isRevealed ? 2 : 1;
        socket.emit("addVote", selectedPlayer.id, nbr, gameId);
        selectionCompleted();
        return;
      }

      if (actionType === "chooseJuniorWolfDeathRevenge") {
        if (!selectedPlayer.role.team.includes("werewolves")) {
          socket.emit(
            "chooseJuniorWolfDeathRevenge",
            {
              juniorWolfId: selectedPlayer.id,
              selectedPlayerId: selectedPlayer.id,
            },
            gameId
          );
          selectionCompleted();
        } else {
          console.log("You can't select a wolf");
        }
        return;
      }

      if (timeOfTheDay === "nighttime" && actionType === "wolfVote") {
        if (!selectedPlayer.role.team.includes("werewolves")) {
          const nbr = clientPlayer.role.name === "Alpha Werewolf" ? 2 : 1;
          socket.emit("addWolfVote", selectedPlayer.id, nbr, gameId);
          selectionCompleted();
        } else {
          console.log("You can't select a wolf");
        }
        return;
      } else {
        if (isSelection) {
          if (
            isJailer &&
            selectedPlayer.isUnderArrest &&
            actionType === "execute"
          ) {
            console.log("socket emit execute");
            socket.emit(
              "executePrisoner",
              {
                type: actionType,
                killerId: clientPlayer.id,
                selectedPlayerId: selectedPlayer.id,
                selectedPlayerName: selectedPlayer.name,
              },
              gameId
            );
          } else if (actionType === "reveal") {
            if (selectedPlayer.isRevealed) {
              console.log("You can't reveal a player that is not revealed");
              return;
            } else {
              socket.emit(
                "revealPlayer",
                {
                  type: actionType,
                  seerId: clientPlayer.id,
                  selectedPlayerId: selectedPlayer.id,
                  selectedPlayerName: selectedPlayer.name,
                },
                gameId
              );
            }
          } else if (actionType === "shoot") {
            socket.emit(
              "shootBullet",
              {
                type: actionType,
                gunnerId: clientPlayer.id,
                selectedPlayerId: selectedPlayer.id,
                selectedPlayerName: selectedPlayer.name,
              },
              gameId
            );
          } else if (actionType === "heal") {
            socket.emit(
              "heal",
              {
                type: actionType,
                playerId: clientPlayer.id,
                selectedPlayerId: selectedPlayer.id,
                selectedPlayerName: selectedPlayer.name,
              },
              gameId
            );
          } else {
            socket.emit(
              "registerAction",
              {
                type: actionType,
                playerId: clientPlayer.id,
                selectedPlayerId: selectedPlayer.id,
                selectedPlayerName: selectedPlayer.name,
                actionTime: clientPlayer.role.canPerform.actionTime,
              },
              gameId
            );
          }
          selectionCompleted();
          return;
        } else if (isDoubleSelection && selectedPlayer1 == null) {
          setSelectedPlayer1(selectedPlayer);
          return;
        } else if (isDoubleSelection && selectedPlayer1) {
          if (actionType === "link") {
            socket.emit(
              "registerAction",
              {
                type: "link",
                lover1Id: selectedPlayer1.id,
                lover2Id: selectedPlayer.id,
                cupidId: clientPlayer.id,
              },
              gameId
            );
          }
          doubleSelectionCompleted();
          return;
        }
      }
    } else {
      console.log("no selection modes are active ");
      return;
    }
  } else {
    console.log("selection's blocked ");
  }
};

export default handlePlayerClick;
