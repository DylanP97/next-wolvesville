"use client";

import Image from "next/image";
import { useGame } from "./GameProvider";
import i18n from "../lib/i18n";

const PlayerInfos = () => {
  const { clientPlayer, weather } = useGame();

  return (
    <div className={`${weather} p-2 relative overflow-hidden w-full`}>
      <p className="text-xs text-white z-20 relative">
        {i18n.language === "fr"
          ? clientPlayer.role.nameFR
          : clientPlayer.role.name}{" "}
        -{" "}
        {i18n.language === "fr"
          ? clientPlayer.role.descriptionFR
          : clientPlayer.role.description}
      </p>
      <Image
        src={clientPlayer.role.image}
        alt="bg-time"
        width={100}
        height={100}
        style={{ width: "auto", height: "auto" }}
        className="m-2 absolute bottom-[-80px] left-[-80px] opacity-30  z-0"
      />
    </div>
  );
};

export default PlayerInfos;
