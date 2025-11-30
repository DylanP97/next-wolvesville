"use client";

import { useGame } from "./GameProvider";

const NightmareOverlay = () => {
  const { clientPlayer, timeOfTheDay } = useGame();

  // Show overlay only during nighttime when player has nightmares
  const shouldShowOverlay =
    clientPlayer?.willHaveNightmares &&
    (timeOfTheDay === "nighttime");

  if (!shouldShowOverlay) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-40 nightmare-overlay">
        {/* Foggy gradient layers */}
        <div className="absolute inset-0 nightmare-fog-layer-1" />
        <div className="absolute inset-0 nightmare-fog-layer-2" />
        <div className="absolute inset-0 nightmare-fog-layer-3" />
      </div>
      <style jsx>{`
        .nightmare-overlay {
          background: rgba(80, 80, 80, 0.7);
          backdrop-filter: blur(4px) grayscale(0.3);
          mix-blend-mode: multiply;
          animation: nightmareFog 15s ease-in-out infinite;
        }

        .nightmare-fog-layer-1 {
          background: radial-gradient(
            circle at 20% 50%,
            rgba(120, 120, 120, 0.4) 0%,
            transparent 50%
          );
          animation: foggyDrift1 20s ease-in-out infinite;
        }

        .nightmare-fog-layer-2 {
          background: radial-gradient(
            circle at 80% 80%,
            rgba(100, 100, 100, 0.4) 0%,
            transparent 50%
          );
          animation: foggyDrift2 25s ease-in-out infinite;
        }

        .nightmare-fog-layer-3 {
          background: radial-gradient(
            circle at 40% 20%,
            rgba(110, 110, 110, 0.3) 0%,
            transparent 50%
          );
          animation: foggyDrift3 18s ease-in-out infinite;
        }

        @keyframes nightmareFog {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes foggyDrift1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(15px, 10px) scale(1.05);
            opacity: 0.5;
          }
        }

        @keyframes foggyDrift2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(-10px, 20px) scale(0.95);
            opacity: 0.5;
          }
        }

        @keyframes foggyDrift3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(10px, -15px) scale(1.1);
            opacity: 0.4;
          }
        }
      `}</style>
    </>
  );
};

export default NightmareOverlay;

