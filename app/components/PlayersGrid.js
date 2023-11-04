"use client";

import Image from "next/image";
import React from "react";
import { Avatar } from "@nextui-org/react";
import tombstone from "@/public/game/tombstone.png";

const PlayersGrid = ({ playersList }) => {
  return (
    <div className="grid grid-cols-4 gap-4 my-6">
      {playersList.map((player) => (
        <div
          className={`${
            player.isAlive ? "bg-gray-700" : "bg-black"
          } w-28 h-36 p-2 rounded-xl flex flex-col justify-center items-center relative`}
          key={player.name}>
          <Image
            width={50}
            height={50}
            src={player.role.image && player.role.image.src}
            alt="role"
          />
          {!player.isAlive && (
            <Image className="absolute" width={60} height={60} src={tombstone} alt="role" />
          )}
        </div>
      ))}
    </div>
  );
};

export default PlayersGrid;
