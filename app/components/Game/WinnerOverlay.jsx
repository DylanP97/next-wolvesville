"use client";

import Image from "next/image";

const WinnerOverlay = ({ winner }) => {
  return (
    <div
      className="winner-overlay"
      style={{
        zIndex: 999,
      }}>
      <div className="winner-message flex flex-col justify-center align-center">
        <Image src={winner.role.image} alt="winner" height={200} width={200} />
        <p>The {winner.role.name} won!</p>
        <p>{winner.name}</p>
      </div>
    </div>
  );
};

export default WinnerOverlay;
