"use client";

import React, { useState, useRef } from "react";
import PlayersGrid from "./PlayersGrid";
import characters from "../data/characters";
import PlayerBoard from "./PlayerBoard";

const GameArea = () => {
  const [timeOfTheDay, setTimeOfTheDay] = useState("nighttime");
  const [dayCount, setDayCount] = useState(0);
  const actionsHistoryListRef = useRef(null);

  const initialPlayersList = [
    {
      id: 0,
      name: "Player 0",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 1,
      name: "Player 1",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 2,
      name: "Player 2",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 3,
      name: "Player 3",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 4,
      name: "Player 4",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 5,
      name: "Player 5",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 6,
      name: "Player 6",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 7,
      name: "Player 7",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 8,
      name: "Player 8",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
    {
      id: 9,
      name: "Player 9",
      role: "",
      isAlive: true,
      roleIsPublic: false,
    },
  ];

  const assignedRoles = new Set();
  const randomRoles = initialPlayersList.map((player, index) => {
    let randomCharacter;
    do {
      randomCharacter =
        characters[Math.floor(Math.random() * characters.length)];
    } while (assignedRoles.has(randomCharacter.name));
    assignedRoles.add(randomCharacter.name);
    return {
      ...player,
      role: randomCharacter,
    };
  });

  const [updatedPlayersList, setUpdatedPlayersList] = useState(randomRoles);
  const [playerToPlay, setPlayerToPlay] = useState(updatedPlayersList[0]);
  const [registeredNightActions, setRegisteredNightActions] = useState([]);

  const killPlayer = (playerId) => {
    console.log("pan " + playerId)
    const newPlayersList = updatedPlayersList.map((player) => {
      if (player.id === playerId) {
        return {
          ...player,
          isAlive: false,
        };
      }
      return player;
    });
    setUpdatedPlayersList(newPlayersList);
    console.log(newPlayersList)
  };

  const displayAction = (message) => {
    const newAction = document.createElement("li");
    newAction.innerText = message;
    actionsHistoryListRef.current.appendChild(newAction);
  };

  const changeTimeOfTheDay = () => {
    if (timeOfTheDay === "nighttime") {
      setDayCount((prevDayCount) => prevDayCount + 1);
      displayAction(`Day ${dayCount} has come... discuss with the village`);

      registeredNightActions.forEach((action) => {
        if (action.action === "shoot") {
          const randomKilledIndex = Math.round(
            Math.random() * updatedPlayersList.length
          );
          killPlayer(randomKilledIndex);
          displayAction(
            `${updatedPlayersList[randomKilledIndex].name} has been killed last night!`
          );
        }
      });
    }
    if (timeOfTheDay === "daytime") {
      displayAction(`Its time to vote!`);
    }
    if (timeOfTheDay === "votetime") {
      displayAction(`beware its night...`);
    }
    setTimeOfTheDay(
      timeOfTheDay === "daytime"
        ? "votetime"
        : timeOfTheDay === "votetime"
        ? "nighttime"
        : "daytime"
    );
  };

  const nextAction = () => {
    if (playerToPlay.id === 9) {
      setPlayerToPlay(updatedPlayersList[0]);
      changeTimeOfTheDay();
    } else {
      setPlayerToPlay(updatedPlayersList[playerToPlay.id + 1]);
    }
  };

  return (
    <section
      className={`${
        timeOfTheDay === "daytime"
          ? "bg-blue-500"
          : timeOfTheDay === "votetime"
          ? "bg-orange-800"
          : "bg-zinc-800"
      } w-full p-4 rounded-xl`}>
      <div className="bg-zinc-900 rounded-xl shadow-lg p-4 my-4">
        {timeOfTheDay === "daytime" ? (
          <p className="text-xs">Daytime n°{dayCount}</p>
        ) : timeOfTheDay === "votetime" ? (
          <p className="text-xs">Votetime n°{dayCount}</p>
        ) : (
          <p className="text-xs">Nighttime n°{dayCount}</p>
        )}
      </div>

      <div className="bg-slate-900 rounded-xl shadow-lg p-4 my-4">
        <p className="text-white text-xs">Actions history</p>
        <ul ref={actionsHistoryListRef}></ul>
      </div>

      <PlayersGrid playersList={updatedPlayersList} />

      <PlayerBoard
        playerToPlay={playerToPlay}
        setPlayerToPlay={setPlayerToPlay}
        registeredNightActions={registeredNightActions}
        setRegisteredNightActions={setRegisteredNightActions}
        nextAction={nextAction}
      />

      {/* <div className="chatbox bg-white rounded-xl shadow-lg p-4 ">
        <p className="text-xs text-black ">Chat box</p>
      </div> */}
    </section>
  );
};

export default GameArea;
