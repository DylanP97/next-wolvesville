"use client";

import Image from "next/image";

const WinnerOverlay = ({ winningTeam }) => {

  return (
    <div
      className="winner-overlay"
      style={{
        zIndex: 999,
      }}>
      <div className="winner-message flex flex-col justify-center align-center">
        <Image src={winningTeam.image} alt="winner" height={200} width={200} className="m-4" />
        <p>The {winningTeam.name} won!</p>
      </div>
    </div>
  );
};

export default WinnerOverlay;
