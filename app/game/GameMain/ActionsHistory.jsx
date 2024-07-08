"use client";

import { useGame } from "../providers/GameProvider";
import Image from "next/image";
import daytime from "../../../public/game/day-time.png";
import votetime from "../../../public/game/vote-time.png";
import nighttime from "../../../public/game/night-time.png";
import { useTranslation } from "react-i18next";
import { replacePlaceholders } from "../../lib/utils";

const ActionsHistory = () => {
  const {
    generalChat,
    wolvesChat,
    jailChat,
    timeOfTheDay,
    isWolf,
    isJailer,
    isUnderArrest,
    hasHandcuffed,
    weather,
  } = useGame();
  const { t } = useTranslation();

  const timeOfDayImages = {
    nighttime,
    votetime,
    daytime,
  };

  class Chat {
    constructor(label, history, emoji) {
      (this.label = label), (this.history = history), (this.emoji = emoji);
    }
  }

  const general = new Chat(t("game.generalChat"), generalChat, "🏘️");
  const wolves = new Chat(t("game.wolvesChat"), wolvesChat, "🐺");
  const jail = new Chat(t("game.jailChat"), jailChat, "👮‍♂️");

  const usedChat =
    isUnderArrest || (isJailer && timeOfTheDay == "nighttime" && hasHandcuffed)
      ? jail
      : timeOfTheDay == "nighttime" && isWolf
      ? wolves
      : general;

  return (
    <div
      className={`${weather} w-full z-10 bg-background p-2 relative overflow-hidden flex flex-col flex-grow min-h-[220px]`}
    >
      <h2 className="text-white text-xs">
        {usedChat.label} {usedChat.emoji}
      </h2>
      <div className="max-h-[200px] z-10 p-2 max-h-80 object-bottom overflow-hidden overflow-y-auto">
        <ul className="actions-list text-white text-xs">
          {usedChat.history.map((msg, index) => {
            if (msg.author) {
              return (
                <li
                  key={index + "msg"}
                  datatype={index + "msg"}
                  className={`text-xs z-20 ${index == 0 && "font-bold"}`}
                >
                  {msg.time} -- {msg.author}: {replacePlaceholders(msg.msg)}
                </li>
              );
            }
            return (
              <li
                className={`text-xs z-20 ${index == 0 && "font-bold"}`}
                key={index + "msg"}
              >
                {msg.time} - {replacePlaceholders(msg.msg)}
              </li>
            );
          })}
        </ul>
      </div>
      <Image
        src={timeOfDayImages[timeOfTheDay]}
        alt="bg-time"
        width={130}
        height={130}
        priority
        style={{ height: "auto", width: "auto" }}
        className="m-2 absolute bottom-[0px] right-[-60px] opacity-30 z-0"
      />
    </div>
  );
};

export default ActionsHistory;
