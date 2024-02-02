"use client";

import Image from "next/image";

const PlayerInfos = ({ clientPlayer }) => {

  console.log(clientPlayer)

  return (
    <div className="bg-slate-950 rounded-xl shadow-lg p-4 mt-4 mb-2">
      <p className="text-xs text-gray-200">{clientPlayer.name}</p>
      <p className="text-xs text-gray-200">Your role is {clientPlayer.role.name}</p>
      <p className="text-xs text-gray-200">{clientPlayer.role.description}</p>
      <Image
        src={clientPlayer.role.image}
        alt="bg-time"
        width={50}
        height={50}
        priority
        style={{ width: "auto", height: "auto" }}
        className="m-2"
      />
    </div>
  )

};

export default PlayerInfos;
