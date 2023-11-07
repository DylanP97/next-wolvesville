"use client";

import Image from "next/image";
import React, { useState } from "react";
import tombstone from "@/public/game/tombstone.png";
import prison from "@/public/game/prison.png";
import forefinger from "@/public/game/forefinger.png";
import { voteAgainst } from "../../lib/gameActions";
import AvatarUI from "../Profile/AvatarUI";

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
}) => {
  const [selectedOtherPlayers, setSelectedOtherPlayers] = useState([]);

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

  const voteForVotetime = (playerId) => {
    voteAgainst(playerId, setUpdatedPlayersList);
    setIsSelectionMode(false);
    toNext();
  };

  const handlePlayerClick = (player) => {
    if (!player.isAlive) {
      console.log("This player is dead. Stop hitting its grave.");
      return;
    }

    if (player.id === playerToPlay.id) {
      console.log("Don't select yourself!");
      return;
    }

    if (isSelectionMode) {
      if (timeOfTheDay === "votetime") {
        voteForVotetime(player.id);
      } else {
        registerActionThatNeedSelection(player);
      }
    } else if (isDoubleSelection) {
      if (selectedOtherPlayers.length === 0) {
        setSelectedOtherPlayers([player]);
      } else if (selectedOtherPlayers.length === 1) {
        // Two players have been selected, perform the double selection action
        registerActionThatNeedDoubleSelection(
          selectedOtherPlayers[0],
          player
        );
        setSelectedOtherPlayers([]); // Reset selected players
      }
    }
  };

  const twClassesPlayerCard =
    "w-44 h-28 m-2 p-4 rounded-3xl flex flex-col justify-center items-center relative gap-2";

  return (
    <div className="grid grid-cols-4 gap-6 my-6 place-items-center xl:w-[80%]">
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
          {timeOfTheDay === "votetime" && player.voteAgainst > 0 && (
            <div className="absolute top-[-10px] right-[-10px] h-8 w-8 p-2 flex justify-center items-center rounded-full bg-red-400">
              <p>{player.voteAgainst}</p>
            </div>
          )}

          {/* Your player icons/images displayed conditionals */}
          {!player.isAlive ? (
            <Image
              className="absolute"
              width={60}
              height={60}
              src={tombstone}
              alt="role"
            />
          ) : !player.isRevealed ? (
            <Image
              width={60}
              height={60}
              src={player.role.image && player.role.image.src}
              alt="role"
              className={
                isDoubleSelection || isSelectionMode ? "opacity-50" : ""
              }
            />
          ) : (
            <AvatarUI selection={isDoubleSelection || isSelectionMode} />
          )}

          {player.isUnderArrest && (
            <>
              <Image
                className="absolute"
                width={100}
                height={100}
                src={prison}
                alt="prison"
              />
            </>
          )}

          {player.id !== playerToPlay.id &&
            player.isAlive &&
            isSelectionMode &&
            timeOfTheDay === "votetime" && (
              <Image
                className="absolute z-10 animate-pulse"
                width={50}
                height={50}
                src={forefinger}
                alt="forefinger"
              />
            )}
          {player.id !== playerToPlay.id &&
            player.isAlive &&
            (isSelectionMode || isDoubleSelection) &&
            timeOfTheDay !== "votetime" && (
              <Image
                className="absolute z-10 animate-pulse"
                width={50}
                height={50}
                src={playerToPlay.role.canPerform.emoji.src}
                alt={playerToPlay.role.canPerform.type}
              />
            )}
          <p className="text-xs text-center">{player.name}</p>
        </div>
      ))}
    </div>
  );
};

export default PlayersGrid;
