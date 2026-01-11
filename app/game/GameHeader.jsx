"use client";

import { useTranslation } from "react-i18next";
import { useGame } from "./GameProvider";

const GameHeader = () => {
  const { timeOfTheDay, dayCount, timeCounter } = useGame();
  const { t } = useTranslation();

  const secondsLeft = timeCounter / 1000;
  const isEndingSoon = secondsLeft <= 5;

  const getTimeString = () => {
    return (
      <>
        n°{dayCount} - <span className={isEndingSoon ? "text-red-400 font-bold" : ""}>{secondsLeft}s</span>{" "}
      </>
    );
  };

  return (
    <div className="px-4 py-2 z-20 w-full bg-gradient-to-t from-slate-700 to-slate-800 border-b border-slate-600 shadow-2xl flex-shrink-0 opacity-70 overflow-hidden relative">
      <p className="text-xs text-white my-2">
        {timeOfTheDay === "daytime" ? (
          <>
            ☀️ {t("game.daytime")} {getTimeString()}
            {t("game.left")}
          </>
        ) : timeOfTheDay === "votetime" ? (
          <>
            🌅🗳️ {t("game.votetime")} {getTimeString()}
            {t("game.left")}
          </>
        ) : timeOfTheDay === "votetimeAftermath" ? (
          <>
            🌅😮 {t("game.votetimeAftermath")} {getTimeString()}
            {t("game.left")}
          </>
        ) : timeOfTheDay === "nighttime" ? (
          <>
            🌙 {t("game.nighttime")} {getTimeString()}
            {t("game.left")}
          </>
        ) : timeOfTheDay === "nighttimeAftermath" ? (
          <>
            🌙😮 {t("game.nighttimeAftermath")} {getTimeString()}
            {t("game.left")}
          </>
        ) : null}
      </p>

    </div>
  );
};

export default GameHeader;