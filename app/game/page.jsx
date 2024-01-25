"use client"

import GameArea from "../components/Game/GameArea";
import { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { useAuth } from "../providers/AuthProvider";

export default function GamePage() {
  const { isInRoom, rooms, socket } = useAuth();

  const [playersList, setPlayersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingPlayers, setIsWaitingPlayers] = useState(true);

  const roomPlaying = rooms.find((room) => room.id == isInRoom);
  const usersInTheRoom = roomPlaying.usersInTheRoom

  class Player {
    constructor(id, name, role, avatar) {
      this.id = id || 0;
      this.name = name || "";
      this.role = role || "";
      this.avatar = avatar || "";
      this.isAlive = true;
      this.isRevealed = false;
      this.voteAgainst = 0;
      this.isUnderArrest = false;
    }
  }

  console.log("usersInTheRoom : ", usersInTheRoom)

  useEffect(() => {
    if (usersInTheRoom.length == roomPlaying.nbrOfPlayers) {
      setIsWaitingPlayers(false)
      socket.emit('launchRoom', roomPlaying.id)
      for (let i = 0; i < roomPlaying?.nbrOfPlayers; i++) {
        new Player(i);
        setPlayersList(playersList => [...playersList, new Player(i)]);
      }
      const shuffledRoles = shuffle(roomPlaying?.selectedRoles);
      setPlayersList(
        playersList.map((player, index) => {
          player.role = shuffledRoles[index];
          player.name = roomPlaying.usersInTheRoom(index).username;
          return player;
        })
      );
      setIsLoading(false)
    }
  }, [usersInTheRoom])

  console.log("playersList : ", playersList)

  return (
    <div>
      {isLoading ?
        isWaitingPlayers ? <p>We wait other players</p> : <p>We shuffle the roles</p>
        : <GameArea playersList={playersList} />}
    </div>
  )
};
