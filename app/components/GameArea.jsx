"use client";

import React, { useState, useRef, useEffect } from "react";
import PlayersGrid from "./PlayersGrid";
import characters from "../data/characters";
import PlayerBoard from "./PlayerBoard";
import initialPlayersList from "../data/playerListTemplate";
import { killSelectedPlayer } from "../data/gameActions";
import ActionsHistory from "./ActionsHistory";
import GameHeader from "./GameHeader";

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
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const displayAction = (message) => {
    const newAction = document.createElement("li");
    newAction.classList.add("text-xs");
    newAction.innerText = message;
    actionsHistoryListRef.current.appendChild(newAction);
  };

  const changeTimeOfTheDay = () => {
    if (timeOfTheDay === "nighttime") {
      setDayCount((prevDayCount) => prevDayCount + 1);
      displayAction(`Day ${dayCount} has come... discuss with the village`);

      registeredNightActions.forEach((action) => {
        if (action.type === "shoot") {
          killSelectedPlayer(action.selectedPlayerId, setUpdatedPlayersList);
          displayAction(
            `The shooter has shot ${
              updatedPlayersList[action.selectedPlayerId].name
            } this night !`
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

  const toNext = () => {
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

  return !gameIsInitialized ? (
    <p>We choose the roles for each player...</p>
  ) : (
    <section
      className={`${
        timeOfTheDay === "daytime"
          ? "bg-blue-500"
          : timeOfTheDay === "votetime"
          ? "bg-orange-800"
          : "bg-slate-950"
      } w-full p-4 rounded-xl`}>
      <GameHeader
        timeOfTheDay={timeOfTheDay}
        dayCount={dayCount}
        playerToPlay={playerToPlay}
      />
      <ActionsHistory actionsHistoryListRef={actionsHistoryListRef} />
      {gameIsInitialized && (
        <>
          <PlayersGrid
            playersList={updatedPlayersList}
            playerToPlay={playerToPlay}
            registeredNightActions={registeredNightActions}
            setRegisteredNightActions={setRegisteredNightActions}
            toNext={toNext}
            isSelectionMode={isSelectionMode}
            setIsSelectionMode={setIsSelectionMode}
          />

          <PlayerBoard
            playerToPlay={playerToPlay}
            setPlayerToPlay={setPlayerToPlay}
            registeredNightActions={registeredNightActions}
            setRegisteredNightActions={setRegisteredNightActions}
            toNext={toNext}
            isSelectionMode={isSelectionMode}
            setIsSelectionMode={setIsSelectionMode}
          />
        </>
      )}
    </section>
  );
};

export default GameArea;
