"use client";

import Image from "next/image";
import { useGame } from "../providers/GameProvider";
import i18n from "../../lib/i18n";

const PlayerInfos = () => {
  const { clientPlayer, weather } = useGame();

  return (
    <div
      className={`${weather} shadow-lg p-4 h-[130px] relative overflow-hidden w-full`}
    >
      <p className="text-xs text-white z-20 my-1 relative">
        {clientPlayer.name} -{" "}
        {i18n.language === "fr"
          ? clientPlayer.role.nameFR
          : clientPlayer.role.name}
      </p>
      <p className="text-xs text-white z-20 relative">
        {i18n.language === "fr"
          ? clientPlayer.role.descriptionFR
          : clientPlayer.role.description}
      </p>
      <Image
        src={clientPlayer.role.image}
        alt="bg-time"
        width={130}
        height={130}
        style={{ width: "auto", height: "auto" }}
        className="m-2 absolute bottom-[-80px] left-[-80px] opacity-30  z-0"
      />
    </div>
  );
};

export default PlayerInfos;
