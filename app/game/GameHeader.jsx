"use client";

import { useTranslation } from "react-i18next";
import { useGame } from "./GameProvider";
import i18n from "../lib/i18n";

const GameHeader = () => {
  const { timeOfTheDay, dayCount, timeCounter, clientPlayer } = useGame();
  const { t } = useTranslation();

  const secondsLeft = timeCounter / 1000;
  const isEndingSoon = secondsLeft <= 3;

  const getTimeString = () => {
    return `n°${dayCount} - ${secondsLeft}s `;
  };

  return (
    <div className="px-6 py-4 z-20 w-full bg-gradient-to-t from-slate-700 to-slate-800 border-b border-slate-600 shadow-2xl flex-shrink-0 opacity-70">
      <p className="text-xs text-white my-2">
        {timeOfTheDay === "daytime" ? (
          <>
            ☀️ {t("game.daytime")}{" "}
            <span className={isEndingSoon ? "text-red-400 font-bold" : ""}>
              {getTimeString()}
            </span>
            {t("game.left")}
          </>
        ) : timeOfTheDay === "votetime" ? (
          <>
            🌅🗳️ {t("game.votetime")}{" "}
            <span className={isEndingSoon ? "text-red-400 font-bold" : ""}>
              {getTimeString()}
            </span>
            {t("game.left")}
          </>
        ) : timeOfTheDay === "votetimeAftermath" ? (
          <>
            🌅😮 {t("game.votetimeAftermath")}{" "}
            <span className={isEndingSoon ? "text-red-400 font-bold" : ""}>
              {getTimeString()}
            </span>
            {t("game.left")}
          </>
        ) : timeOfTheDay === "nighttime" ? (
          <>
            🌙 {t("game.nighttime")}{" "}
            <span className={isEndingSoon ? "text-red-400 font-bold" : ""}>
              {getTimeString()}
            </span>
            {t("game.left")}
          </>
        ) : timeOfTheDay === "nighttimeAftermath" ? (
          <>
            🌙😮 {t("game.nighttimeAftermath")}{" "}
            <span className={isEndingSoon ? "text-red-400 font-bold" : ""}>
              {getTimeString()}
            </span>
            {t("game.left")}
          </>
        ) : null}
      </p>

      <p className="text-xs italic">
        {t("game.youAre")}{" "}
        {i18n.language === "fr" ? clientPlayer.role.nameFR : clientPlayer.role.name}{" "}
        -{" "}
        {i18n.language === "fr"
          ? clientPlayer.role.descriptionFR
          : clientPlayer.role.description}
      </p>
    </div>
  );
};

export default GameHeader;
