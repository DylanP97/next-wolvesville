"use client";

import Image from "next/image";
import React from "react";
import tombstone from "@/public/game/tombstone.png";

const PlayersGrid = ({
  playersList,
  playerToPlay,
  isSelectionMode,
  setIsSelectionMode,
  registeredNightActions,
  setRegisteredNightActions,
  toNext,
}) => {

  const registerNightAction = (otherSelectedPlayerId) => {
    setRegisteredNightActions([
      ...registeredNightActions,
      {
        type: playerToPlay.role.canPerformAtNighttime.type,
        player: playerToPlay.id,
        selectedPlayerId: otherSelectedPlayerId,
      },
    ])
    setIsSelectionMode(false);
    toNext();
  };

  return (
    <div className="grid grid-cols-4 gap-4 my-6">
      {playersList.map((player) => (
        <div
          className={`${
            player.isAlive
              ? player.id !== playerToPlay.id
                ? isSelectionMode
                  ? "bg-slate-800 opacity-50 hover:bg-red-800 cursor-pointer"
                  : "bg-slate-700"
                : "bg-yellow-950"
              : "bg-black"
          } ${
            playerToPlay.id === player.id && "border border-slate"
          } w-28 h-36 p-2 rounded-xl flex flex-col justify-center items-center relative gap-2`}
          key={player.name}
          onClick={() =>
            player.isAlive &&
            player.id !== playerToPlay.id &&
            isSelectionMode &&
            registerNightAction(player.id)
          }>
          <Image
            width={50}
            height={50}
            src={player.role.image && player.role.image.src}
            alt="role"
          />
          {!player.isAlive && (
            <Image
              className="absolute"
              width={60}
              height={60}
              src={tombstone}
              alt="role"
            />
          )}
          <p className="text-xs">{player.name}</p>
        </div>
      ))}
    </div>
  );
};

export default PlayersGrid;
