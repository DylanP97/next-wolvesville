"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const IsInRoomInfo = ({ isInRoom, isPlaying }) => {
  const { t } = useTranslation();

  useEffect(() => {
    console.log("IsInRoomInfo updated:", { isInRoom, isPlaying });
  }, [isInRoom, isPlaying]);

  if (isPlaying && isInRoom)
    return (
      <p className="text-md text-white">
        🟢🎮 {t("home.status.1")} {isInRoom}
      </p>
    );
  if (!isPlaying && isInRoom) {
    return (
      <p className="text-md text-white">
        🟡🎮 {t("home.status.1")} {isInRoom}
      </p>
    );
  }
  if (!isPlaying && !isInRoom) {
    return <p className="text-md text-white">🔴🎮 {t("home.status.2")}</p>;
  }
};

export default IsInRoomInfo;
