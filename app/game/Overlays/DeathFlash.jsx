"use client";

import { useGame } from "../GameProvider";

const DeathFlash = () => {
  const { showDeathFlash } = useGame();

  if (!showDeathFlash) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[9999] pointer-events-none death-flash-overlay"
      />
      <style jsx>{`
        @keyframes deathFlash {
          0% {
            background-color: rgba(0, 0, 0, 0.7);
          }
          50% {
            background-color: rgba(220, 38, 38, 0.9);
          }
          100% {
            background-color: rgba(0, 0, 0, 0);
          }
        }
        
        .death-flash-overlay {
          animation: deathFlash 300ms ease-out;
        }
      `}</style>
    </>
  );
};

export default DeathFlash;