"use client";

import React, { useState, useRef, useEffect } from "react";
import PlayersGrid from "./PlayersGrid";
import characters from "../../lib/characters";
import PlayerBoard from "./PlayerBoard";
import initialPlayersList from "../../lib/playerListTemplate";
import {
  aftermathOfVote,
  arrestPlayer,
  cleanUpRegisteredActionsConcerningDeadPlayers,
  shootBullet,
} from "../../lib/gameActions";
import ActionsHistory from "./ActionsHistory";
import GameHeader from "./GameHeader";
import { shortName } from "@/app/lib/randomUsername";

const GameArea = () => {
  const [gameIsInitialized, setGameIsInitialized] = useState(false);
  const [timeOfTheDay, setTimeOfTheDay] = useState(null);
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
    let randomName
    randomName = shortName();
    return {
      ...player,
      name: randomName,
      role: randomCharacter,
    };
  });

  const [updatedPlayersList, setUpdatedPlayersList] = useState(randomRoles);
  const [playerToPlay, setPlayerToPlay] = useState(updatedPlayersList[0]);
  const [registeredActions, setRegisteredActions] = useState([]);
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

      registeredActions.forEach((action) => {
        if (action.actionTime === "night") {
          if (action.type === "shoot")
            shootBullet(
              action,
              updatedPlayersList,
              setUpdatedPlayersList,
              displayAction
            );
        }
      });
      setRegisteredActions([]);
    }
    if (timeOfTheDay === "daytime") {
      displayAction(`Its time to vote!`);
    }
    if (timeOfTheDay === "votetime") {
      aftermathOfVote(displayAction, updatedPlayersList, setUpdatedPlayersList);

      cleanUpRegisteredActionsConcerningDeadPlayers(
        updatedPlayersList,
        setRegisteredActions
      );
    }
    if (timeOfTheDay === "nighttime") {
      displayAction(`beware its night...`);

      registeredActions.forEach((action) => {
        if (action.actionTime === "day") {
          if (action.type === "arrest")
            arrestPlayer(
              action,
              updatedPlayersList,
              setUpdatedPlayersList,
              displayAction
            );
        }
      });
      setRegisteredActions([]);
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
    setTimeOfTheDay("nighttime");
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
            registeredActions={registeredActions}
            setRegisteredActions={setRegisteredActions}
            toNext={toNext}
            isSelectionMode={isSelectionMode}
            setIsSelectionMode={setIsSelectionMode}
            updatedPlayersList={updatedPlayersList}
            setUpdatedPlayersList={setUpdatedPlayersList}
            timeOfTheDay={timeOfTheDay}
          />

          <PlayerBoard
            timeOfTheDay={timeOfTheDay}
            playerToPlay={playerToPlay}
            registeredActions={registeredActions}
            setRegisteredActions={setRegisteredActions}
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
