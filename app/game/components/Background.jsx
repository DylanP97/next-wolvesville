"use client";

import Image from "next/image";
import daytime from "../../../public/game/day-time.png";
import votetime from "../../../public/game/vote-time.png";
import nighttime from "../../../public/game/night-time.png";
import prisonBg from "../../../public/game/prison-bg.jpg";
import { useGame } from "../providers/GameProvider";

const Background = () => {
  const { isJailer, isUnderArrest, hasHandcuffed, timeOfTheDay } = useGame();

  const timeOfDayImages = {
    nighttime,
    votetime,
    daytime,
  };

  if (
    isUnderArrest ||
    (isJailer && timeOfTheDay == "nighttime" && hasHandcuffed)
  )
    return (
      <Image
        src={prisonBg}
        alt="bg-jail"
        width={2000}
        height={2000}
        priority
        style={{ height: "auto", width: "auto" }}
        className="absolute top-0 h-full min-w-full opacity-20 z-0"
      />
    );

  // return (
  //   <Image
  //     src={timeOfDayImages[timeOfTheDay]}
  //     alt="bg-time"
  //     width={200}
  //     height={200}
  //     priority
  //     style={{ height: "auto", width: "auto" }}
  //     className="absolute top-44 right-80 opacity-20 z-0 overflow-clip	"
  //   />
  // );
};

export default Background;
