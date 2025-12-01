"use client";

import { useGame } from "./GameProvider";

const PrisonOverlay = () => {
  const { isUnderArrest, timeOfTheDay } = useGame();

  // Show overlay only during nighttime when player is under arrest
  const shouldShowOverlay =
    isUnderArrest &&
    (timeOfTheDay === "nighttime");

  if (!shouldShowOverlay) {
    return null;
  }

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-10 prison-overlay">
        {/* Dark prison atmosphere */}
        <div className="absolute inset-0 prison-darkness" />
        
        {/* Vertical prison bars */}
        <div className="absolute inset-0 prison-bars">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="prison-bar"
              style={{
                left: `${(i + 1) * 11}%`,
              }}
            />
          ))}
        </div>

        {/* Horizontal bars at top and bottom */}
        <div className="prison-bar-horizontal" style={{ top: '15%' }} />
        <div className="prison-bar-horizontal" style={{ top: '85%' }} />
      </div>
      <style jsx>{`
        .prison-overlay {
          background: rgba(20, 20, 30, 0.6);
          animation: prisonPulse 8s ease-in-out infinite;
        }

        .prison-darkness {
          background: radial-gradient(
            ellipse at center,
            transparent 20%,
            rgba(0, 0, 0, 0.7) 100%
          );
        }

        .prison-bars {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .prison-bar {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 12px;
          background: linear-gradient(
            to right,
            rgba(40, 40, 45, 0.95) 0%,
            rgba(80, 80, 90, 0.98) 20%,
            rgba(100, 100, 110, 1) 50%,
            rgba(80, 80, 90, 0.98) 80%,
            rgba(40, 40, 45, 0.95) 100%
          );
          box-shadow: 
            inset 2px 0 4px rgba(150, 150, 160, 0.4),
            inset -2px 0 4px rgba(0, 0, 0, 0.8),
            0 0 20px rgba(0, 0, 0, 0.8);
          border-radius: 2px;
          animation: barShadow 6s ease-in-out infinite;
        }

        .prison-bar-horizontal {
          position: absolute;
          left: 0;
          right: 0;
          height: 12px;
          background: linear-gradient(
            to bottom,
            rgba(40, 40, 45, 0.95) 0%,
            rgba(80, 80, 90, 0.98) 20%,
            rgba(100, 100, 110, 1) 50%,
            rgba(80, 80, 90, 0.98) 80%,
            rgba(40, 40, 45, 0.95) 100%
          );
          box-shadow: 
            inset 0 2px 4px rgba(150, 150, 160, 0.4),
            inset 0 -2px 4px rgba(0, 0, 0, 0.8),
            0 0 20px rgba(0, 0, 0, 0.8);
          border-radius: 2px;
          animation: barShadow 6s ease-in-out infinite;
        }

        @keyframes prisonPulse {
          0%, 100% {
            opacity: 0.9;
          }
          50% {
            opacity: 0.95;
          }
        }

        @keyframes barShadow {
          0%, 100% {
            filter: brightness(0.9);
          }
          50% {
            filter: brightness(1.1);
          }
        }
      `}</style>
    </>
  );
};

export default PrisonOverlay;