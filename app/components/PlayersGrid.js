"use client";

import Image from "next/image";
import React from "react";
import { Avatar } from "@nextui-org/react";

const PlayersGrid = ({ playersList, playerName }) => {
  return (
    <div className="grid grid-cols-4 gap-4 my-8">
      {playersList.map((player) => (
        <div
          className={`${
            player.name === playerName ? "bg-gray-500" : "bg-gray-700"
          } w-24 h-36 p-2 rounded-xl `}
          key={player.name}>
          <Avatar isBordered color="secondary" src={player.role.image.src} />
          <small className="text-center">{player.role.name}</small>
          <br />
          <small className="text-center">{player.name}</small>
        </div>
      ))}
    </div>
  );
};

export default PlayersGrid;
