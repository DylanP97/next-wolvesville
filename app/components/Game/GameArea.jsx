"use client";

import React, { useState, useRef, useEffect } from "react";
import PlayersGrid from "./PlayersGrid";
import PlayerBoard from "./PlayerBoard";
import {
  aftermathOfVote,
  cleanUpRegisteredActionsConcerningDeadPlayers,
} from "../../lib/gameActions";
import ActionsHistory from "./ActionsHistory";
import GameHeader from "./GameHeader";
import {
  arrestPlayer,
  linkLovers,
  releasePrisoners,
  revealPlayer,
  shootBullet,
} from "@/app/lib/charactersActions";
import Image from "next/image";
import daytime from "@/public/game/day-time.png";
import votetime from "@/public/game/vote-time.png";
import nighttime from "@/public/game/night-time.png";

const GameArea = ({ randomRoles }) => {
  const [gameIsInitialized, setGameIsInitialized] = useState(false);
  const [timeOfTheDay, setTimeOfTheDay] = useState(null);
  const [dayCount, setDayCount] = useState(0);
  const actionsHistoryListRef = useRef(null);
  const [updatedPlayersList, setUpdatedPlayersList] = useState(null);
  const [playerToPlay, setPlayerToPlay] = useState(null);
  const [registeredActions, setRegisteredActions] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDoubleSelection, setIsDoubleSelection] = useState(false);
  const [winner, setWinner] = useState(false);

  const displayAction = (message) => {
    const newAction = document.createElement("li");
    newAction.classList.add("text-xs");
    newAction.innerText = message;
    actionsHistoryListRef.current.appendChild(newAction);
  };

  registeredActions.forEach((action) => {
    if (action.type === "shoot") {
      shootBullet(
        action,
        updatedPlayersList,
        setUpdatedPlayersList,
        displayAction
      );
      setRegisteredActions([...registeredActions.filter((a) => a !== action)]);
    }
    if (action.type === "love") {
      linkLovers(action, setUpdatedPlayersList);
      setRegisteredActions([...registeredActions.filter((a) => a !== action)]);
    }
    if (action.type === "reveal") {
      revealPlayer(
        action,
        updatedPlayersList,
        setUpdatedPlayersList,
        displayAction
      );
      setRegisteredActions([...registeredActions.filter((a) => a !== action)]);
    }
  });

  const changeTimeOfTheDay = () => {
    if (timeOfTheDay === "nighttime") {
      // end of night, beginning of day
      setDayCount((prevDayCount) => prevDayCount + 1);
      displayAction(`Day ${dayCount} has come... discuss with the village`);
      releasePrisoners(setUpdatedPlayersList);
    }
    if (timeOfTheDay === "daytime") {
      // end of daytime, beginning of votetime
      displayAction(`Its time to vote!`);
    }
    if (timeOfTheDay === "votetime") {
      // end of votetime, beginning of nighttime

      displayAction(`beware its night...`);
      aftermathOfVote(
        displayAction,
        updatedPlayersList,
        setUpdatedPlayersList,
        setWinner
      );
      cleanUpRegisteredActionsConcerningDeadPlayers(
        updatedPlayersList,
        setRegisteredActions
      );
      registeredActions.forEach((action) => {
        console.log("hello");
        console.log(action);
        if (action.type === "arrest")
          arrestPlayer(
            action,
            updatedPlayersList,
            setUpdatedPlayersList,
            displayAction
          );
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

  const findNextAlivePlayer = (currentPlayerId) => {
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

  const toNext = (event = null) => {
    if (!event || (event.type === "keydown" && event.key === "Enter")) {
      const { index: nextPlayerId, isFirstAlivePlayer } = findNextAlivePlayer(
        playerToPlay.id
      );

      if (isFirstAlivePlayer) {
        setPlayerToPlay(updatedPlayersList[nextPlayerId]);
        changeTimeOfTheDay();
      } else {
        setPlayerToPlay(updatedPlayersList[nextPlayerId]);
      }
    }
  };

  useEffect(() => {
    if (randomRoles) {
      setUpdatedPlayersList(randomRoles);
      setPlayerToPlay(randomRoles[0]);
      setTimeOfTheDay("nighttime");
      setGameIsInitialized(true);
    }
  }, [randomRoles]);

  return !gameIsInitialized ? (
    <p>We choose the roles for each player...</p>
  ) : (
    <section
      onKeyDown={toNext}
      tabIndex={0}
      className={`${
        timeOfTheDay === "daytime"
          ? "bg-blue-500"
          : timeOfTheDay === "votetime"
          ? "bg-orange-800"
          : "bg-slate-950"
      } w-full p-4 rounded-xl relative`}
      style={{ outline: "none" }}>
      <GameHeader
        timeOfTheDay={timeOfTheDay}
        dayCount={dayCount}
        playerToPlay={playerToPlay}
      />
      <Image
        src={
          timeOfTheDay === "nighttime"
            ? nighttime
            : timeOfTheDay === "votetime"
            ? votetime
            : daytime
        }
        alt="bg-time"
        width={500}
        height={500}
        priority
        style={{ width: "auto", height: "auto" }}
        className="absolute top-44 right-80 opacity-20"
      />
      {gameIsInitialized && (
        <div className="xl:flex xl:flex-row">
          <PlayersGrid
            playersList={updatedPlayersList}
            playerToPlay={playerToPlay}
            registeredActions={registeredActions}
            setRegisteredActions={setRegisteredActions}
            toNext={toNext}
            isSelectionMode={isSelectionMode}
            setIsSelectionMode={setIsSelectionMode}
            isDoubleSelection={isDoubleSelection}
            setIsDoubleSelection={setIsDoubleSelection}
            updatedPlayersList={updatedPlayersList}
            setUpdatedPlayersList={setUpdatedPlayersList}
            timeOfTheDay={timeOfTheDay}
          />

          <div className="xl:w-[20%]">
            <PlayerBoard
              timeOfTheDay={timeOfTheDay}
              playerToPlay={playerToPlay}
              registeredActions={registeredActions}
              setRegisteredActions={setRegisteredActions}
              toNext={toNext}
              isSelectionMode={isSelectionMode}
              setIsSelectionMode={setIsSelectionMode}
              isDoubleSelection={isDoubleSelection}
              setIsDoubleSelection={setIsDoubleSelection}
            />
            <ActionsHistory actionsHistoryListRef={actionsHistoryListRef} />
          </div>
        </div>
      )}
      {winner && (
        <div
          className="winner-overlay"
          style={{
            zIndex: 999,
          }}>
          <div className="winner-message flex flex-col justify-center align-center">
            <Image
              src={winner.role.image}
              alt="winner"
              height={200}
              width={200}
            />
            <p>The {winner.role.name} won!</p>
            <p>{winner.name}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GameArea;
