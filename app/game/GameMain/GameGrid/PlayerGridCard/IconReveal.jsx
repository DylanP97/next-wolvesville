"use client";

import Image from "next/image";

const IconReveal = ({ roleIcon }) => {
  return (
    <div className="absolute bottom-50 right-2 h-6 aspect-square flex justify-center items-center">
      <Image src={roleIcon} width={40} height={40} alt="role" />
    </div>
  );
};

export default IconReveal;
