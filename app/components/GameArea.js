"use client";

import React, { useState, useRef, useEffect } from "react";
import PlayersGrid from "./PlayersGrid";
import characters from "../data/characters";
import PlayerBoard from "./PlayerBoard";
import initialPlayersList from "../data/playerListTemplate";

const GameArea = () => {
  const [gameIsInitialized, setGameIsInitialized] = useState(false);
  const [timeOfTheDay, setTimeOfTheDay] = useState("nighttime");
  const [dayCount, setDayCount] = useState(0);
  const actionsHistoryListRef = useRef(null);

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
    setUpdatedPlayersList((prevPlayersList) => {
      // Create a new array based on the previous state
      return prevPlayersList.map((player) => {
        if (player.id === playerId) {
          // If the player matches the playerId, mark them as not alive
          return {
            ...player,
            isAlive: false,
          };
        }
        return player;
      });
    });
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

  const findNextPlayerToPlayAlive = (currentPlayerId) => {
    let isFirstAlivePlayer = false;

    if (
      currentPlayerId === -1 ||
      currentPlayerId === updatedPlayersList.length - 1
    ) {
      for (let i = 0; i < updatedPlayersList.length; i++) {
        if (updatedPlayersList[i].isAlive) {
          if (i === 0) {
            isFirstAlivePlayer = true;
          }
          return { index: i, isFirstAlivePlayer };
        }
      }
    } else {
      for (let i = currentPlayerId + 1; i < updatedPlayersList.length; i++) {
        if (updatedPlayersList[i].isAlive) {
          return { index: i, isFirstAlivePlayer };
        }
      }

      for (let i = 0; i < currentPlayerId; i++) {
        if (updatedPlayersList[i].isAlive) {
          if (i === 0) {
            isFirstAlivePlayer = true;
          }
          return { index: i, isFirstAlivePlayer };
        }
      }
    }

    return { index: -1, isFirstAlivePlayer };
  };

  const nextAction = () => {
    const { index: nextPlayerId, isFirstAlivePlayer } =
      findNextPlayerToPlayAlive(playerToPlay.id);

    if (isFirstAlivePlayer) {
      setPlayerToPlay(updatedPlayersList[nextPlayerId]);
      changeTimeOfTheDay();
    } else {
      setPlayerToPlay(updatedPlayersList[nextPlayerId]);
    }
  };

  useEffect(() => {
    setGameIsInitialized(true);
  }, []);

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

      {gameIsInitialized && (
        <>
          <PlayersGrid
            playersList={updatedPlayersList}
            playerToPlay={playerToPlay}
          />

          <PlayerBoard
            playerToPlay={playerToPlay}
            setPlayerToPlay={setPlayerToPlay}
            registeredNightActions={registeredNightActions}
            setRegisteredNightActions={setRegisteredNightActions}
            nextAction={nextAction}
          />
        </>
      )}
    </section>
  );
};

export default GameArea;
