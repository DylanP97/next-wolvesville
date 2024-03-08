'use client'

import Image from "next/image";
import daytime from "../../../public/game/day-time.png";
import votetime from "../../../public/game/vote-time.png";
import nighttime from "../../../public/game/night-time.png";
import prisonBg from "../../../public/game/prison-bg.jpg";

const Background = ({
    timeOfTheDay,
    clientPlayer
}) => {
  const timeOfDayImages = {
    nighttime,
    votetime,
    daytime,
  };

  if (clientPlayer.isUnderArrest || (clientPlayer.role.name === "Jailer" && timeOfTheDay == "nighttime" && clientPlayer.hasHandcuffed)) return (
    <Image
      src={prisonBg}
      alt='bg-jail'
      width={2000}
      height={2000}
      priority
      className="absolute top-0 h-full min-w-full opacity-20 z-0"
    />
  )
  
  return (
    <Image
      src={timeOfDayImages[timeOfTheDay]}
      alt="bg-time"
      width={500}
      height={500}
      priority
      className="absolute top-44 right-80 opacity-20 z-0"
    />
  );
};

export default Background;
