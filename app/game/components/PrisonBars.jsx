'use client'

import Image from "next/image";
import prisonBars from "../../../public/game/prison.png";

const PrisonBars = () => {
    
  return (
    <Image
      src={prisonBars}
      alt="bg-time"
      width={500}
      height={500}
      priority
      style={{ width: "auto", height: "auto" }}
      className="absolute top-0 z-30 h-[70%] w-screen"
    />
  );
};

export default PrisonBars;
