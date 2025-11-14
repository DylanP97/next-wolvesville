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
  player,
  setSelectedPlayer,
  selectedPlayer1,
  setSelectedPlayer1,
  setErrorMessage,
  triggerAnimation,
  language
) => {
  function selectionCompleted() {
    setSelectedPlayer(player);
    setIsBlocked(true);
    setIsSelection(false);
  }

  function doubleSelectionCompleted() {
    setIsBlocked(true);
    setIsDoubleSelection(false);
  }

  if (clientPlayer.isAlive) {
    if (!isBlocked) {
      if (isSelection || isDoubleSelection) {
        if (player.id === clientPlayer.id) {
          setErrorMessage("errorMessage.0001");
          return;
        }

        if (!player.isAlive) {
          if (clientPlayer.role.name === "Grave Robber") {
            if (actionType === "loot") {
              // socket.emit("lootGrave", player.id, gameId);
              selectionCompleted();
              return;
            }
          }
          setErrorMessage("errorMessage.0002");
          triggerAnimation("loomingGrave");
          return;
        }

        if (clientPlayer.role.name === "Grave Robber") {
          if (actionType === "loot") {
            setErrorMessage("errorMessage.0003");
            return;
          }
        }

        if (!isJailer && player.isUnderArrest) {
          setErrorMessage("errorMessage.0004");
          return;
        }

        if (isJailer && actionType === "execute" && !player.isUnderArrest) {
          setErrorMessage("errorMessage.0005");
          return;
        }

        if (timeOfTheDay === "votetime" && actionType === "vote") {
          const nbr =
            clientPlayer.role.name === "Mayor" && clientPlayer.isRevealed
              ? 2
              : 1;
          socket.emit(
            "addVote",
            {
              type: "addVote",
              playerId: clientPlayer.id,
              playerName: clientPlayer.name,
              selectedPlayerId: player.id,
              selectedPlayerName: player.name,
              nbr: nbr,
            },
            gameId
          );
          selectionCompleted();
          return;
        }

        if (actionType === "chooseJuniorWolfDeathRevenge") {
          if (!player.role.team === "Werewolves") {
            socket.emit(
              "chooseJuniorWolfDeathRevenge",
              {
                juniorWolfId: player.id,
                selectedPlayerId: player.id,
              },
              gameId
            );
            selectionCompleted();
          } else {
            setErrorMessage("errorMessage.0006");
          }
          return;
        }

        if (timeOfTheDay === "nighttime" && actionType === "wolfVote") {
          if (player.role.team !== "Werewolves") {
            const nbr = clientPlayer.role.name === "Alpha Werewolf" ? 2 : 1;
            socket.emit(
              "addWolfVote",
              {
                playerId: clientPlayer.id,
                playerName: clientPlayer.name,
                selectedPlayerId: player.id,
                selectedPlayerName: player.name,
                nbr: nbr,
              },
              gameId
            );
            // For Wolf Seer, don't block selection after wolf vote
            // so they can still perform uncover role in the same night
            if (clientPlayer.role.name === "Wolf Seer") {
              setSelectedPlayer(player);
              setIsSelection(false);
              // Don't call selectionCompleted() here
            } else {
              selectionCompleted();
            }
          } else {
            setErrorMessage("errorMessage.0007");
          }
          return;
        } else {
          if (isSelection) {
            if (isJailer && player.isUnderArrest && actionType === "execute") {
              socket.emit(
                "executePrisoner",
                {
                  type: actionType,
                  killerId: clientPlayer.id,
                  selectedPlayerId: player.id,
                  selectedPlayerName: player.name,
                },
                gameId
              );
            } else if (actionType === "reveal") {
              if (player.isRevealed) {
                setErrorMessage("errorMessage.0008");
                return;
              } else {
                socket.emit(
                  "revealPlayer",
                  {
                    type: actionType,
                    seerId: clientPlayer.id,
                    selectedPlayerId: player.id,
                    selectedPlayerName: player.name,
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
                  selectedPlayerId: player.id,
                  selectedPlayerName: player.name,
                },
                gameId
              );
            } else if (actionType === "heal") {
              socket.emit(
                "heal",
                {
                  type: actionType,
                  playerId: clientPlayer.id,
                  selectedPlayerId: player.id,
                  selectedPlayerName: player.name,
                },
                gameId
              );
            } else if (actionType === "protectPotion") {
              socket.emit(
                "protectPotion",
                {
                  type: actionType,
                  playerId: clientPlayer.id,
                  selectedPlayerId: player.id,
                  selectedPlayerName: player.name,
                },
                gameId
              );
            } else if (actionType === "poisonPotion") {
              socket.emit(
                "poisonPotion",
                {
                  type: actionType,
                  playerId: clientPlayer.id,
                  selectedPlayerId: player.id,
                  selectedPlayerName: player.name,
                },
                gameId
              );
            } else if (actionType === "uncoverRole") {
              // Wolf Seer can't select other wolves
              if (player.role.team === "Werewolves") {
                setErrorMessage("errorMessage.0007");
                return;
              }
              
              // Wolf Seer can't select already revealed players
              if (player.isRevealed) {
                setErrorMessage("errorMessage.0008");
                return;
              }
              
              socket.emit(
                "uncoverRole",
                {
                  type: actionType,
                  wolfSeerId: clientPlayer.id,
                  selectedPlayerId: player.id,
                  selectedPlayerName: player.name,
                },
                gameId
              );
              // For Wolf Seer, don't block selection after uncovering role
              // so they can still perform wolf vote in the same night
              setSelectedPlayer(player);
              setIsSelection(false);
              // Don't call selectionCompleted() here
              return;
            } else {
              socket.emit(
                "registerAction",
                {
                  type: actionType,
                  playerId: clientPlayer.id,
                  selectedPlayerId: player.id,
                  selectedPlayerName: player.name,
                  actionTime: clientPlayer.role.canPerform1.actionTime,
                },
                gameId
              );
            }
            selectionCompleted();
            return;
          } else if (isDoubleSelection && selectedPlayer1 == null) {
            setSelectedPlayer1(player);
            return;
          } else if (isDoubleSelection && selectedPlayer1) {
            if (actionType === "link") {
              socket.emit(
                "registerAction",
                {
                  type: "link",
                  lover1Id: selectedPlayer1.id,
                  lover2Id: player.id,
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
        setErrorMessage("errorMessage.0009");
        return;
      }
    } else {
      setErrorMessage("errorMessage.0010");
    }
  } else {
    setErrorMessage("errorMessage.0011");
    triggerAnimation("deadStuck");
    return;
  }
};

export default handlePlayerClick;
