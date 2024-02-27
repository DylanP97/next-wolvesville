"use client";

import Image from "next/image";

const PlayerInfos = ({ clientPlayer }) => {

  return (
    <div className="bg-slate-950 shadow-lg p-4 h-[130px] relative overflow-hidden w-full z-10">
      <p className="text-xs text-gray-200 z-20">{clientPlayer.name} - {clientPlayer.role.name}</p>
      <p className="text-xs text-gray-200 z-20">{clientPlayer.role.description}</p>
      <Image
        src={clientPlayer.role.image}
        alt="bg-time"
        width={130}
        height={130}
        style={{ width: "auto", height: "auto" }}
        className="m-2 absolute bottom-[-80px] left-[-80px] opacity-50"
      />
    </div>
  )

};

export default PlayerInfos;
