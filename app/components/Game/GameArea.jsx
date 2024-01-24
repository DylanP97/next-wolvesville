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
  throwHolyWater,
  investigatePlayers,
  aftermathOfNightWolvesAttack,
} from "../../lib/gameActions";
import WinnerOverlay from "./WinnerOverlay";
import PlayerInfos from "./PlayerInfos";
import teams from "../../lib/teams";
import { Button } from "@nextui-org/react";
import Background from "./Background";

const GameArea = ({ playersList }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [updatedPlayersList, setUpdatedPlayersList] = useState(playersList);
  const [timeOfTheDay, setTimeOfTheDay] = useState("nighttime");
  const [dayCount, setDayCount] = useState(0);
  const actionsHistoryListRef = useRef(null);
  const [aliveList, setAliveList] = useState(null);
  const [playerToPlay, setPlayerToPlay] = useState(playersList[0]);
  const [registeredActions, setRegisteredActions] = useState([]);
  const [selectedActionButton, setSelectedActionButton] = useState(1);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDoubleSelection, setIsDoubleSelection] = useState(false);
  const [winningTeam, setWinningTeam] = useState(null);

  const checkForWinner = (aliveList) => {
    const firstPlayerTeam = aliveList[0].role.team.join();
    let opponentFound = false;

    for (let i = 1; i < aliveList.length; i++) {
      const currentPlayerTeam = aliveList[i].role.team.join();
      if (currentPlayerTeam !== firstPlayerTeam) {
        opponentFound = true;
        console.log("there is no winner still, the game continues!");
        break;
      }
    }

    if (!opponentFound) {
      let wArr = teams.filter((t) => t.name === firstPlayerTeam);
      setWinningTeam(wArr[0]);
    }
  };

  const displayAction = (message, itsANewDay) => {
    const newAction = document.createElement("li");
    newAction.classList.add("text-xs");
    newAction.innerText = message;
    if (itsANewDay) {
      const divider = document.createElement("hr");
      actionsHistoryListRef.current.prepend(divider);
    }
    actionsHistoryListRef.current.prepend(newAction);
  };

  const handleInstantaneousActions = (action) => {
    switch (action.type) {
      case "craft":
        craftTheBomb(action, setUpdatedPlayersList);
        setRegisteredActions(registeredActions.filter((a) => a !== action));
        break;
      case "pouring":
        pourGasoline(action, setUpdatedPlayersList);
        setRegisteredActions(registeredActions.filter((a) => a !== action));
        break;
      case "heal":
        heal(action, setUpdatedPlayersList);
        setRegisteredActions(registeredActions.filter((a) => a !== action));
        break;
      case "shoot":
        shootBullet(action, updatedPlayersList, setUpdatedPlayersList, displayAction);
        setRegisteredActions(registeredActions.filter((a) => a !== action));
        break;
      case "love":
        linkLovers(action, setUpdatedPlayersList);
        setRegisteredActions(registeredActions.filter((a) => a !== action));
        break;
      case "reveal":
        revealPlayer(action, updatedPlayersList, setUpdatedPlayersList, displayAction);
        setRegisteredActions(registeredActions.filter((a) => a !== action));
        break;
      default:
        break;
    }
  };

  registeredActions.forEach((action) => {
    handleInstantaneousActions(action);
  });

  const changeTimeOfTheDay = () => {
    if (timeOfTheDay === "nighttime") {
      aftermathOfNightWolvesAttack(displayAction, updatedPlayersList, setUpdatedPlayersList);
      cleanUpRegisteredActionsConcerningDeadPlayers(updatedPlayersList, setRegisteredActions);
      registeredActions.forEach((action) => {
        if (action.type === "investigate") {
          investigatePlayers(action, displayAction, updatedPlayersList);
          setRegisteredActions([...registeredActions.filter((a) => a !== action)]);
        }
        if (action.type === "throw") {
          throwHolyWater(action, updatedPlayersList, setUpdatedPlayersList, displayAction);
          setRegisteredActions([...registeredActions.filter((a) => a !== action)]);
        }
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
      displayAction(`Day ${dayCount + 1} has come... discuss with the village`, true);
    }
    if (timeOfTheDay === "daytime") {
      registeredActions.forEach((action) => {
        if (action.type === "mute") {
          muteVoter(action, setUpdatedPlayersList);
        }
      });
      displayAction(`Its time to vote!`);
    }
    if (timeOfTheDay === "votetime") {
      aftermathOfVote(displayAction, updatedPlayersList, setUpdatedPlayersList, setWinningTeam);
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
      displayAction(`Its night...`);
    }
    checkForWinner(aliveList);
    setTimeOfTheDay(timeOfTheDay === "daytime" ? "votetime" : timeOfTheDay === "votetime" ? "nighttime" : "daytime");
  };

  const toNext = (event = null) => {
    if (!event || (event.type === "keydown" && event.key === "Enter")) {
      const index = aliveList.findIndex((player) => player.id === playerToPlay.id);
      const nextPlayer = aliveList[index + 1];
      if (!nextPlayer) {
        changeTimeOfTheDay();
        setPlayerToPlay(aliveList[0]);
      } else {
        setIsDoubleSelection(false);
        setIsSelectionMode(false);
        setSelectedActionButton(1);
        setPlayerToPlay(nextPlayer);
      }
      checkForWinner(aliveList);
    }
  };

  const handleStartGame = () => {
    checkForWinner(aliveList);
    setGameStarted(true);
    displayAction(`It's night, the game has begun...`);
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
    selectedActionButton,
    setSelectedActionButton,
  };

  useEffect(() => {
    if (updatedPlayersList) {
      const onlyAliveList = updatedPlayersList.filter((player) => player.isAlive);
      setAliveList(onlyAliveList);
    }
  }, [updatedPlayersList]);

  return (
    <section
      onKeyDown={(event) => {
        if (gameStarted) {
          if (event.key === "1") {
          } else if (event.key === "2") {
          } else if (event.key === "Enter") {
            toNext(event);
          }
        }
      }}
      tabIndex={0}
      className={`${
        timeOfTheDay === "daytime" ? "bg-sky-500" : timeOfTheDay === "votetime" ? "bg-sky-700" : "bg-black"
      } h-screen w-screen p-4 relative`}
      style={{ outline: "none" }}>
      <GameHeader timeOfTheDay={timeOfTheDay} dayCount={dayCount} />
      <Background timeOfTheDay={timeOfTheDay} />
      <div className="xl:flex xl:flex-row">
        <div className="xl:w-[20%]">
          {gameStarted && <PlayerInfos playerToPlay={playerToPlay} />}
          <ActionsHistory actionsHistoryListRef={actionsHistoryListRef} />
          {gameStarted && <PlayerBoard {...sharedProps} />}
          {!gameStarted && (
            <div className=" xl:w-[80%] xl:h-[100%]">
              <Button className="w-full" variant="ghost" color="primary" onClick={() => handleStartGame()}>
                Start Game
              </Button>
            </div>
          )}
        </div>
        {gameStarted && <PlayersGrid {...sharedProps} />}
      </div>

      {winningTeam && <WinnerOverlay winningTeam={winningTeam} />}
    </section>
  );
};
export default GameArea;
