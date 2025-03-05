"use client";

import { useTranslation } from "react-i18next";
import { useGame } from "./GameProvider";
import i18n from "../lib/i18n";

const GameHeader = () => {
  const { timeOfTheDay, dayCount, timeCounter, weather, clientPlayer } =
    useGame();
  const { t } = useTranslation();

  return (
    <div className="p-2 z-10">
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
        <>
          {" "}
          -{" "}
          {i18n.language === "fr"
            ? clientPlayer.role.nameFR
            : clientPlayer.role.name}
        </>
      </p>
      <p className="text-xs italic">
        {i18n.language === "fr"
          ? clientPlayer.role.descriptionFR
          : clientPlayer.role.description}
      </p>
    </div>
  );
};

export default GameHeader;
