"use client";

import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { useGame } from "../providers/GameProvider";
import PlayerGridCard from "./GameGrid/PlayerGridCard";

const GameGrid = () => {
  const { socket } = useAuth();

  const {
    playersList,
    timeOfTheDay,
    gameId,
    clientPlayer,
    isJailer,
    isSelection,
    setIsSelection,
    isDoubleSelection,
    setIsDoubleSelection,
    isBlocked,
    setIsBlocked,
    actionType,
  } = useGame();

  const [selectedPlayer1, setSelectedPlayer1] = useState(null);

  const handlePlayerClick = (selectedPlayer) => {
    function selectionCompleted() {
      setIsBlocked(true);
      setIsSelection(false);
    }

    function doubleSelectionCompleted() {
      setIsBlocked(true);
      setIsDoubleSelection(false);
    }

    if (!isBlocked) {
      // we supposed to select someone if there is one of the selection modes turn on
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
          console.log(
            "this player is locked up in jail. You can't select him."
          );
          return;
        }

        if (timeOfTheDay == "votetime" && actionType == "vote") {
          const nbr = clientPlayer.role.name === "Mayor" ? 2 : 1;
          socket.emit("addVote", selectedPlayer.id, nbr, gameId);
          selectionCompleted();
          return;
        }

        if (timeOfTheDay == "nighttime" && actionType == "devours") {
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
              actionType == "execute"
            ) {
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
            } else if (actionType == "reveal") {
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
            } else if (actionType == "shoot") {
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
            } else if (actionType == "heal") {
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
            if (actionType == "link") {
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
        console.log("no selection modes isn't active ");
        return;
      }
    } else {
      console.log("selection's blocked ");
    }
  };

  return (
    <div className={`flex flex-row place-items-center w-full xl:w-[80%]`}>
      {playersList.map((player) => {
        const isAlsoWolf = player.role.team.includes("werewolves");

        return (
          <PlayerGridCard
            key={"plycard-" + player.id}
            player={player}
            selectedPlayer1={selectedPlayer1}
            isAlsoWolf={isAlsoWolf}
            handlePlayerClick={handlePlayerClick}
          />
        );
      })}
    </div>
  );
};

export default GameGrid;
