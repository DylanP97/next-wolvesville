"use client";

import daytime from "../../public/game/day-time.png";
import votetime from "../../public/game/vote-time.png";
import nighttime from "../../public/game/night-time.png";
import { useGame } from "./GameProvider";
import Image from "next/image";

const Background = () => {
  const { isJailer, isUnderArrest, hasHandcuffed, timeOfTheDay } = useGame();

  const timeOfDayImages = {
    nighttime,
    votetime,
    daytime,
  };

  const timeOfDayBg = {
    nighttime: "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1740574883/night_sky_n25lme.jpg",
    votetime: "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1740574883/evening_sky_m4nvkh.jpg",
    daytime: "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1740574885/day_sky_tamgja.jpg"
  };

  return (
    <Image
      src={timeOfDayBg[timeOfTheDay]}
      alt="bg-time"
      width={2000}
      height={2000}
      priority
      className="absolute h-full object-cover min-w-full top-0 left-0 z-0"
    />
  );
};

export default Background;
