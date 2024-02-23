"use client";

import Image from "next/image";

const PlayerInfos = ({ clientPlayer, timeOfTheDay }) => {

  return (
    <div className="bg-slate-950 rounded-xl shadow-lg p-4 my-2 h-[100px] relative overflow-hidden w-full">
      <p className="text-xs text-gray-200">{clientPlayer.name}</p>
      <p className="text-xs text-gray-200">Your role is {clientPlayer.role.name}</p>
      <p className="text-xs text-gray-200">{clientPlayer.role.description}</p>
      <Image
        src={clientPlayer.role.image}
        alt="bg-time"
        width={130}
        height={130}
        style={{ width: "auto", height: "auto" }}
        className="m-2 absolute bottom-[-80px] left-[-80px] opacity-50 "
      />
    </div>
  )

};

export default PlayerInfos;
