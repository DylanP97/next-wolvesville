"use client";

import { useState } from "react";
import { doubleVoteAgainst, voteAgainst } from "../../lib/gameActions";
import PlayerCardImage from "./PlayerCardImage";
import VoteCount from "./VoteCount";
import {
  becomeAccomplice,
  investigatePlayers,
} from "@/app/lib/charactersActions";

const PlayersGrid = ({
  playersList,
  playerToPlay,
  isSelectionMode,
  setIsSelectionMode,
  registeredActions,
  setRegisteredActions,
  timeOfTheDay,
  updatedPlayersList,
  setUpdatedPlayersList,
  toNext,
  isDoubleSelection,
  setIsDoubleSelection,
  displayAction,
}) => {
  const [selectedOtherPlayers, setSelectedOtherPlayers] = useState([]);
  const [displayInvestigation, setDisplayInvestigation] = useState(false);
  const [investigationResult, setInvestigationResult] = useState(null);
  const [investigatedPlayers, setInvestigatedPlayers] = useState(null);

  const registerActionThatNeedSelection = (otherSelectedPlayer) => {
    setRegisteredActions([
      ...registeredActions,
      {
        type: playerToPlay.role.canPerform.type,
        player: playerToPlay.id,
        selectedPlayer: otherSelectedPlayer,
        actionTime: playerToPlay.role.canPerform.actionTime,
      },
    ]);
    setIsSelectionMode(false);

    toNext();
  };

  const registerActionThatNeedDoubleSelection = (
    otherSelectedPlayer,
    otherSelected2Player
  ) => {
    setRegisteredActions([
      ...registeredActions,
      {
        type: playerToPlay.role.canPerform.type,
        player: playerToPlay.id,
        selectedPlayer: otherSelectedPlayer.id,
        actionTime: playerToPlay.role.canPerform.actionTime,
      },
      {
        type: playerToPlay.role.canPerform.type,
        player: playerToPlay.id,
        selectedPlayer: otherSelected2Player.id,
        actionTime: playerToPlay.role.canPerform.actionTime,
      },
    ]);
    setIsDoubleSelection(false);
    toNext();
  };

  const voteForVotetime = (playerId, isMayor) => {
    isMayor
      ? doubleVoteAgainst(playerId, setUpdatedPlayersList)
      : voteAgainst(playerId, setUpdatedPlayersList);
    setIsSelectionMode(false);
    toNext();
  };

  const handlePlayerClick = (player) => {
    if (!player.isAlive) {
      if (playerToPlay.role.name === "Grave Robber") {
        registerActionThatNeedSelection(player);
        return;
      } else {
        console.log("This player is dead. Stop hitting its grave.");
        return;
      }
    }

    if (player.id === playerToPlay.id) {
      console.log("Don't select yourself!");
      return;
    }

    if (isSelectionMode) {
      if (timeOfTheDay === "votetime") {
        const isMayor = playerToPlay.role.name === "Mayor";
        voteForVotetime(player.id, isMayor);
      } else {
        if (playerToPlay.role.name === "Grave Robber") {
          console.log("this player is alive");
          return;
        } else if (
          playerToPlay.role.name === "Pyromaniac" &&
          playerToPlay.role.playersToSetOnFire.some(
            (pouredPlayer) => player.id === pouredPlayer.id
          )
        ) {
          console.log("You already poured gasoline on this player.");
          return;
        } else if (playerToPlay.role.name === "Bandit") {
          if (!playerToPlay.role.partner) {
            becomeAccomplice(playerToPlay, player, setUpdatedPlayersList, toNext);
            return;
          }
        }
        registerActionThatNeedSelection(player);
      }
    } else if (isDoubleSelection) {
      if (selectedOtherPlayers.length === 0) {
        setSelectedOtherPlayers([player]);
      } else if (selectedOtherPlayers.length === 1) {
        if (playerToPlay.role.canPerform.type === "investigate") {
          investigatePlayers(
            setInvestigatedPlayers,
            setInvestigationResult,
            setDisplayInvestigation,
            setIsDoubleSelection,
            toNext,
            selectedOtherPlayers[0],
            player,
            displayAction
          );
        } else {
          // Two players have been selected, perform the double selection action
          registerActionThatNeedDoubleSelection(
            selectedOtherPlayers[0],
            player
          );
          setSelectedOtherPlayers([]); // Reset selected players
        }
      }
    }
  };

  const twClassesPlayerCard =
    "w-48 h-36 p-4 rounded-3xl flex flex-col justify-center items-center relative gap-2";

  return (
    <div className="grid grid-cols-4 gap-6 my-6 place-items-center xl:w-[80%]">
      {/* mapping every players */}
      {playersList.map((player) => (
        <div
          className={`${
            player.isAlive
              ? player.id !== playerToPlay.id
                ? isSelectionMode || isDoubleSelection
                  ? "bg-slate-800 hover:bg-red-800 cursor-pointer"
                  : "bg-slate-700"
                : "bg-yellow-950"
              : "bg-black"
          } ${
            playerToPlay.id === player.id && "border border-slate"
          } ${twClassesPlayerCard}`}
          key={player.name}
          onClick={() => handlePlayerClick(player)}>
          <VoteCount timeOfTheDay={timeOfTheDay} player={player} />

          {/* Your player avatar displayed conditionals */}
          <PlayerCardImage
            timeOfTheDay={timeOfTheDay}
            player={player}
            playerToPlay={playerToPlay}
            isDoubleSelection={isDoubleSelection}
            isSelectionMode={isSelectionMode}
            displayInvestigation={displayInvestigation}
            investigationResult={investigationResult}
            investigatedPlayers={investigatedPlayers}
          />

          <p className="text-xs text-center">{player.name}</p>
        </div>
      ))}
    </div>
  );
};

export default PlayersGrid;
