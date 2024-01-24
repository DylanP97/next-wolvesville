"use client"

import GameArea from "./GameArea";
import { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { useAuth } from "../../providers/AuthProvider";

const GamePage = () => {
  const [playersList, setPlayersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isInRoom, rooms } = useAuth();
  const roomPlaying = rooms.find((room) => room.id == isInRoom);

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

  useEffect(() => {
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
  }, [])

  console.log(playersList)

  return (
    <div>
      {isLoading ? (
        <div>
          <p>We shuffle the roles</p>
        </div>
      ) : (
        <GameArea playersList={playersList} />
      )}
    </div>
  )
};

export default GamePage;
