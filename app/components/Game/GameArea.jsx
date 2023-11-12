"use client";

import { useState, useRef, useEffect } from "react";
import PlayersGrid from "./PlayersGrid";
import PlayerBoard from "./PlayerBoard";
import ActionsHistory from "./ActionsHistory";
import GameHeader from "./GameHeader";
import {
  aftermathOfVote,
  cleanUpRegisteredActionsConcerningDeadPlayers,
  arrestPlayer,
  linkLovers,
  murder,
  releasePrisoners,
  revealPlayer,
  shootBullet,
  heal,
  pourGasoline,
  muteVoter,
  unmuteVoter,
  craftTheBomb,
  robTheRole,
  eliminate,
} from "@/app/lib/gameActions";
import Image from "next/image";
import daytime from "@/public/game/day-time.png";
import votetime from "@/public/game/vote-time.png";
import nighttime from "@/public/game/night-time.png";
import WinnerOverlay from "./WinnerOverlay";

const GameArea = ({ randomRoles }) => {
  const [gameIsInitialized, setGameIsInitialized] = useState(false);
  const [timeOfTheDay, setTimeOfTheDay] = useState(null);
  const [dayCount, setDayCount] = useState(0);
  const actionsHistoryListRef = useRef(null);
  const [updatedPlayersList, setUpdatedPlayersList] = useState(null);
  const [aliveList, setAliveList] = useState(null);
  const [playerToPlay, setPlayerToPlay] = useState(null);
  const [registeredActions, setRegisteredActions] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDoubleSelection, setIsDoubleSelection] = useState(false);
  const [winner, setWinner] = useState(false);

  const timeOfDayImages = {
    nighttime,
    votetime,
    daytime,
  };

  const displayAction = (message) => {
    const newAction = document.createElement("li");
    newAction.classList.add("text-xs");
    newAction.innerText = message;
    actionsHistoryListRef.current.appendChild(newAction);
  };

  const handleInstantaneousActions = (action) => {
    switch (action.type) {
      case "craft":
        craftTheBomb(action, setUpdatedPlayersList);
        break;
      case "pouring":
        pourGasoline(action, setUpdatedPlayersList);
        break;
      case "heal":
        heal(action, setUpdatedPlayersList);
        break;
      case "shoot":
        shootBullet(action, updatedPlayersList, setUpdatedPlayersList, displayAction);
        break;
      case "love":
        linkLovers(action, setUpdatedPlayersList);
        break;
      case "reveal":
        revealPlayer(action, updatedPlayersList, setUpdatedPlayersList, displayAction);
        break;
      default:
        break;
    }
  };

  // Handle instantaneous actions
  registeredActions.forEach((action) => {
    handleInstantaneousActions(action);
    setRegisteredActions(registeredActions.filter((a) => a !== action));
  });

  const changeTimeOfTheDay = () => {
    if (timeOfTheDay === "nighttime") {
      // end of night, beginning of day
      registeredActions.forEach((action) => {
        if (action.type === "eliminate") {
          eliminate(action, updatedPlayersList, setUpdatedPlayersList, displayAction);
          setRegisteredActions([...registeredActions.filter((a) => a !== action)]);
        }
        if (action.type === "loot") {
          robTheRole(action, setUpdatedPlayersList, displayAction);
          setRegisteredActions([...registeredActions.filter((a) => a !== action)]);
        }
        if (action.type === "murder") {
          murder(action, updatedPlayersList, setUpdatedPlayersList, displayAction);
          setRegisteredActions([...registeredActions.filter((a) => a !== action)]);
        }
      });
      releasePrisoners(setUpdatedPlayersList);
      setDayCount((prevDayCount) => prevDayCount + 1);
      displayAction(`Day ${dayCount + 1} has come... discuss with the village`);
    }
    if (timeOfTheDay === "daytime") {
      // end of daytime, beginning of votetime
      registeredActions.forEach((action) => {
        if (action.type === "mute") {
          muteVoter(action, setUpdatedPlayersList);
        }
      });
      displayAction(`Its time to vote!`);
    }
    if (timeOfTheDay === "votetime") {
      // end of votetime, beginning of nighttime

      displayAction(`beware its night...`);
      aftermathOfVote(displayAction, updatedPlayersList, setUpdatedPlayersList, setWinner);
      cleanUpRegisteredActionsConcerningDeadPlayers(updatedPlayersList, setRegisteredActions);
      registeredActions.forEach((action) => {
        if (action.type === "arrest") {
          arrestPlayer(action, updatedPlayersList, setUpdatedPlayersList, displayAction);
          setRegisteredActions([...registeredActions.filter((a) => a !== action)]);
        } else if (action.type === "mute") {
          unmuteVoter(action, setUpdatedPlayersList);
          setRegisteredActions([...registeredActions.filter((a) => a !== action)]);
        }
      });
    }
    setTimeOfTheDay(
      timeOfTheDay === "daytime"
        ? "votetime"
        : timeOfTheDay === "votetime"
        ? "nighttime"
        : "daytime"
    );
  };

  const toNext = (event = null) => {
    if (!event || (event.type === "keydown" && event.key === "Enter")) {
      const index = aliveList.findIndex((player) => player.id === playerToPlay.id);
      const nextPlayer = aliveList[index + 1];
      if (!nextPlayer) {
        changeTimeOfTheDay();
        setPlayerToPlay(aliveList[0]);
      } else setPlayerToPlay(nextPlayer);
      setIsDoubleSelection(false);
      setIsSelectionMode(false);
    }
  };

  const sharedProps = {
    playerToPlay,
    registeredActions,
    setRegisteredActions,
    toNext,
    isSelectionMode,
    setIsSelectionMode,
    isDoubleSelection,
    setIsDoubleSelection,
    updatedPlayersList,
    setUpdatedPlayersList,
    timeOfTheDay,
    displayAction,
  };

  useEffect(() => {
    if (updatedPlayersList) {
      const onlyAliveList = updatedPlayersList.filter((player) => player.isAlive);
      setAliveList(onlyAliveList);
    }
  }, [updatedPlayersList]);

  useEffect(() => {
    if (randomRoles) {
      setUpdatedPlayersList(randomRoles);
      setPlayerToPlay(randomRoles[0]);
      setTimeOfTheDay("nighttime");
      setGameIsInitialized(true);
    }
  }, [randomRoles]);

  return !gameIsInitialized ? (
    <p className="w-full h-full m-auto p-8">We choose the roles for each player...</p>
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
      } w-full h-full p-8 relative`}
      style={{ outline: "none" }}>
      <GameHeader timeOfTheDay={timeOfTheDay} dayCount={dayCount} playerToPlay={playerToPlay} />
      <Image
        src={timeOfDayImages[timeOfTheDay]}
        alt="bg-time"
        width={500}
        height={500}
        priority
        style={{ width: "auto", height: "auto" }}
        className="absolute top-44 right-80 opacity-20"
      />
      {gameIsInitialized && (
        <div className="xl:flex xl:flex-row">
          <PlayersGrid {...sharedProps} />
          <div className="xl:w-[20%]">
            <PlayerBoard {...sharedProps} />
            <ActionsHistory actionsHistoryListRef={actionsHistoryListRef} />
          </div>
        </div>
      )}
      {winner && <WinnerOverlay winner={winner} />}
    </section>
  );
};

export default GameArea;
