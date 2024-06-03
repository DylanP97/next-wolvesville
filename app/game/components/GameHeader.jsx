"use client";

import { useTranslation } from "react-i18next";
import { useGame } from "../providers/GameProvider";

const GameHeader = () => {
  const { timeOfTheDay, dayCount, timeCounter, weather } = useGame();
  const { t } = useTranslation();

  return (
    <div className={`${weather} text-white shadow-lg p-2`}>
      <p className="text-xs text-white">
        {timeOfTheDay === "daytime" ? (
          <>
            ☀️ {t("game.daytime")} n° {dayCount} - {timeCounter / 1000}s{" "}
            {t("game.left")}
          </>
        ) : timeOfTheDay === "votetime" ? (
          <>
            🌅🗳️ {t("game.votetime")} n°{dayCount} - {timeCounter / 1000}s{" "}
            {t("game.left")}
          </>
        ) : (
          <>
            🌙 {t("game.nighttime")} n°{dayCount} - {timeCounter / 1000}s{" "}
            {t("game.left")}
          </>
        )}
      </p>
    </div>
  );
};

export default GameHeader;
