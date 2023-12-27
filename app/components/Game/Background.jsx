'use client'

import Image from "next/image";
import daytime from "@/public/game/day-time.png";
import votetime from "@/public/game/vote-time.png";
import nighttime from "@/public/game/night-time.png";

const Background = ({
    timeOfTheDay
}) => {
  const timeOfDayImages = {
    nighttime,
    votetime,
    daytime,
  };

  return (
    <Image
      src={timeOfDayImages[timeOfTheDay]}
      alt="bg-time"
      width={500}
      height={500}
      priority
      style={{ width: "auto", height: "auto" }}
      className="absolute top-44 right-80 opacity-20"
    />
  );
};

export default Background;
