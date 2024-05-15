"use client";

import { useGame } from "../providers/GameProvider";

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
  } = useGame();

  class Chat {
    constructor(label, history, emoji) {
      (this.label = label), (this.history = history), (this.emoji = emoji);
    }
  }

  const general = new Chat("General", generalChat, "🏘️");
  const wolves = new Chat("Wolves", wolvesChat, "🐺");
  const jail = new Chat("Jail", jailChat, "👮‍♂️");

  const usedChat =
    (isUnderArrest || (isJailer && timeOfTheDay == "nighttime" && hasHandcuffed))
      ? jail
      : timeOfTheDay == "nighttime" && isWolf
      ? wolves
      : general;

  return (
    <div className="w-full z-10 bg-gray-800 p-2">
      <h2 className="text-white">
        {usedChat.label} Chat {usedChat.emoji}
      </h2>
      <div className="h-[120px] z-10 p-2 max-h-72 object-bottom overflow-hidden overflow-y-auto">
        <ul className="actions-list text-white">
          {usedChat.history.map((msg, index) => {
            if (msg.author) {
              return (
                <li
                  key={index + "msg"}
                  datatype={index + "msg"}
                  className={`text-xs z-20 ${index == 0 && "font-bold"}`}
                >
                  {msg.time} -- {msg.author}: {msg.msg}
                </li>
              );
            }
            return (
              <li
                className={`text-xs z-20 ${index == 0 && "font-bold"}`}
                key={index + "msg"}
              >
                {msg.time} -- {msg.msg}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ActionsHistory;
