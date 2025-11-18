"use client";

import { useTranslation } from "react-i18next";
import { useGame } from "./GameProvider";
import i18n from "../lib/i18n";

const GameHeader = () => {
  const { timeOfTheDay, dayCount, timeCounter, weather, clientPlayer } =
    useGame();
  const { t } = useTranslation();

  return (
    <div className="px-6 z-20 fixed w-full py-2 bg-gradient-to-t from-slate-700 to-slate-800 border-b border-slate-600 shadow-2xl">
      <p className="text-xs text-white my-2">
        {timeOfTheDay === "daytime" ? (
          <>
            ☀️ {t("game.daytime")} n°{dayCount} - {timeCounter / 1000}s{" "}
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
      <p className="text-sm italic">
        {t("game.youAre")}{" "}
        {i18n.language === "fr"
            ? clientPlayer.role.nameFR
            : clientPlayer.role.name} {" "}
          -{" "}
        {i18n.language === "fr"
          ? clientPlayer.role.descriptionFR
          : clientPlayer.role.description}
      </p>
    </div>
  );
};

export default GameHeader;
