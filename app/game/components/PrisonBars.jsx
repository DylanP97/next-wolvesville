'use client'

import Image from "next/image";
import prisonBars from "../../../public/game/prison.png";

const PrisonBars = () => {
    
  return (
    <Image
      src={prisonBars}
      alt="prisonBars"
      width={1500}
      height={1500}
      priority
      style={{ width: "auto", height: "auto" }}
      className="absolute top-0 z-30 h-full w-full"
    />
  );
};

export default PrisonBars;
