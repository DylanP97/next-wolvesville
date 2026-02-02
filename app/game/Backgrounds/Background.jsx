"use client";

import { useGame } from "../GameProvider";
import Image from "next/image";

const BLUR_PLACEHOLDER =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsKDA0QDAsNEA0KCxEVEBETFRQVFRsMDxcYFhQYEhT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAABv/EAB8QAAIBBAMBAQAAAAAAAAAAAAECAwAEBRESITFBUf/EABQBAQAAAAAAAAAAAAAAAAAAAAP/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEQA/AJzi8VBkMpYWsxcRzTJG5X2AWIBx+6qf9paUoVbJEkNnZ//Z";

const phases = [
  {
    key: "nighttime",
    src: "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1740574883/night_sky_n25lme.jpg",
  },
  {
    key: "votetime",
    src: "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1740574883/evening_sky_m4nvkh.jpg",
  },
  {
    key: "daytime",
    src: "https://res.cloudinary.com/dnhq4fcyp/image/upload/v1740574885/day_sky_tamgja.jpg",
  },
];

const Background = () => {
  const { timeOfTheDay } = useGame();

  return (
    <>
      {phases.map((phase) => (
        <Image
          key={phase.key}
          src={phase.src}
          alt={`bg-${phase.key}`}
          width={2000}
          height={2000}
          priority
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          className={`absolute h-full object-cover min-w-full top-0 left-0 z-0 transition-opacity duration-700 ${
            timeOfTheDay === phase.key ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
};

export default Background;
