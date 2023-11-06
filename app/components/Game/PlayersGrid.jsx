"use client";

import Image from "next/image";
import React from "react";
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
}) => {
  const registerActionThatNeedSelection = (otherSelectedPlayerId) => {
    setRegisteredActions([
      ...registeredActions,
      {
        type: playerToPlay.role.canPerform.type,
        player: playerToPlay.id,
        selectedPlayerId: otherSelectedPlayerId,
        actionTime: playerToPlay.role.canPerform.actionTime,
      },
    ]);
    setIsSelectionMode(false);

    toNext();
  };

  const voteForVotetime = (playerId) => {
    voteAgainst(playerId, setUpdatedPlayersList);
    setIsSelectionMode(false);
    toNext();
  };

  const twClassesPlayerCard = "w-44 h-28 m-2 p-4 rounded-3xl flex flex-col justify-center items-center relative gap-2"

  return (
    <div className="grid grid-cols-4 gap-6 my-6 place-items-center	">
      {playersList.map((player) => (
        <div
          className={`${
            player.isAlive
              ? player.id !== playerToPlay.id
                ? isSelectionMode
                  ? "bg-slate-800 opacity-70 hover:bg-red-800 cursor-pointer"
                  : "bg-slate-700"
                : "bg-yellow-950"
              : "bg-black"
          } ${
            playerToPlay.id === player.id && "border border-slate"
          } ${twClassesPlayerCard}`}
          key={player.name}
          onClick={() =>
            player.isAlive && isSelectionMode && player.id !== playerToPlay.id
              ? timeOfTheDay !== "votetime"
                ? registerActionThatNeedSelection(player.id)
                : voteForVotetime(player.id)
              : console.log("don't select yourself!")
          }>
          {/* below : player icons/images displayed conditionnals */}
          {!player.isRevealed ? (
            <Image
              width={40}
              height={40}
              src={player.role.image && player.role.image.src}
              alt="role"
            />
          ) : (
            <AvatarUI />
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
            isSelectionMode &&
            timeOfTheDay !== "votetime" && (
              <Image
                className="absolute z-10 animate-pulse"
                width={50}
                height={50}
                src={playerToPlay.role.canPerform.emoji.src}
                alt={playerToPlay.role.canPerform.type}
              />
            )}
          {!player.isAlive ? (
            <Image
              className="absolute"
              width={60}
              height={60}
              src={tombstone}
              alt="role"
            />
          ) : (
            player.isUnderArrest && (
              <>
                <Image
                  className="absolute"
                  width={100}
                  height={100}
                  src={prison}
                  alt="prison"
                />
              </>
            )
          )}
          <p className="text-xs text-center">{player.name}</p>
        </div>
      ))}
    </div>
  );
};

export default PlayersGrid;
