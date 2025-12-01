"use client";

import { useMemo } from "react";
import { useGame } from "./GameProvider";

const NightmareOverlay = () => {
  const { clientPlayer, timeOfTheDay } = useGame();

  // Show overlay only during nighttime when player has nightmares
  const shouldShowOverlay =
    clientPlayer?.willHaveNightmares &&
    (timeOfTheDay === "nighttime");

  // Memoize bat animations with different directions
  const batAnimations = useMemo(() =>
    [...Array(6)].map((_, i) => {
      const direction = Math.floor(Math.random() * 4); // 0: left-to-right, 1: right-to-left, 2: top-to-bottom, 3: bottom-to-top
      const startPos = Math.random() * 60 + 10; // Random start position (10-70%)
      
      return {
        direction,
        startPos,
        animationDelay: `${i * 1.2}s`,
        animationDuration: `${4 + Math.random() * 2}s`,
      };
    }),
    []
  );

  // Memoize eye animations
  const eyeAnimations = useMemo(() =>
    [...Array(4)].map(() => ({
      left: `${10 + Math.random() * 80}%`,
      top: `${20 + Math.random() * 70}%`,
      animationDelay: `${Math.random() * 5}s`,
      transform: `scale(${0.5 + Math.random() * 0.5})`,
    })),
    []
  );

  if (!shouldShowOverlay) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-20 nightmare-overlay">
        {/* Dark Purple/Red tint for anxiety */}
        <div className="absolute inset-0 nightmare-filter" />

        {/* Pulsing Vignette - feels like a heartbeat/tunnel vision */}
        <div className="absolute inset-0 nightmare-vignette" />

        {/* --- SHADOW BATS --- */}
        <div className="absolute inset-0 bats-container">
          {batAnimations.map((animation, i) => (
            <div
              key={`bat-${i}`}
              className={`bat-wrapper direction-${animation.direction}`}
              style={{
                animationDelay: animation.animationDelay,
                animationDuration: animation.animationDuration,
                ...(animation.direction === 0 || animation.direction === 1
                  ? { top: `${animation.startPos}%` }
                  : { left: `${animation.startPos}%` }),
              }}
            >
              <div className="bat-body">
                <div className="wing left" />
                <div className="wing right" />
                <div className="bat-head">
                  <div className="bat-ear left" />
                  <div className="bat-ear right" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- WATCHING EYES --- */}
        {/* These fade in and out in the background darkness */}
        <div className="absolute inset-0 eyes-container">
          {eyeAnimations.map((animation, i) => (
            <div
              key={`eyes-${i}`}
              className="evil-eyes"
              style={animation}
            >
              <div className="eye-glow left" />
              <div className="eye-glow right" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .nightmare-overlay {
          animation: nightmareFade 0.5s ease-in;
        }

        .nightmare-filter {
          background: rgba(40, 0, 20, 0.4);
          backdrop-filter: grayscale(0.5) contrast(1.2) hue-rotate(-20deg);
          mix-blend-mode: overlay;
        }

        .nightmare-vignette {
          background: radial-gradient(
            circle at center,
            transparent 30%,
            rgba(30, 0, 10, 0.6) 70%,
            rgba(0, 0, 0, 0.95) 100%
          );
          animation: vignettePulse 2s ease-in-out infinite;
        }

        /* --- BAT STYLES --- */
        .bats-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .bat-wrapper {
          position: absolute;
          width: 80px;
          height: 50px;
        }

        /* Left to Right */
        .bat-wrapper.direction-0 {
          left: -100px;
          animation: batFlyLeftToRight linear infinite;
        }

        /* Right to Left */
        .bat-wrapper.direction-1 {
          right: -100px;
          animation: batFlyRightToLeft linear infinite;
          transform: scaleX(-1); /* Flip horizontally */
        }

        /* Top to Bottom */
        .bat-wrapper.direction-2 {
          top: -100px;
          animation: batFlyTopToBottom linear infinite;
          transform: rotate(90deg);
        }

        /* Bottom to Top */
        .bat-wrapper.direction-3 {
          bottom: -100px;
          animation: batFlyBottomToTop linear infinite;
          transform: rotate(-90deg);
        }

        .bat-body {
          position: relative;
          width: 100%;
          height: 100%;
          animation: batSwoop 2s ease-in-out infinite alternate;
        }

        .bat-head {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 12px;
          height: 16px;
          background: #1a1a1a;
          transform: translate(-50%, -50%);
          border-radius: 40%;
          z-index: 2;
        }

        .bat-ear {
          position: absolute;
          top: -6px;
          width: 0;
          height: 0;
          border-left: 3px solid transparent;
          border-right: 3px solid transparent;
          border-bottom: 8px solid #1a1a1a;
        }
        .bat-ear.left { left: 0; transform: rotate(-15deg); }
        .bat-ear.right { right: 0; transform: rotate(15deg); }

        .wing {
          position: absolute;
          top: 50%;
          width: 40px;
          height: 25px;
          background: #1a1a1a;
          transform-origin: center right;
          /* Bat wing shape */
          clip-path: polygon(100% 0, 0 5%, 20% 40%, 5% 100%, 40% 70%, 70% 100%, 100% 40%);
        }

        .wing.left {
          right: 50%;
          transform-origin: right center;
          animation: wingFlapLeft 0.15s ease-in-out infinite alternate;
        }

        .wing.right {
          left: 50%;
          transform: scaleX(-1); /* Mirror the left wing */
          transform-origin: left center;
          animation: wingFlapRight 0.15s ease-in-out infinite alternate;
        }

        /* --- EVIL EYES STYLES --- */
        .evil-eyes {
          position: absolute;
          width: 40px;
          height: 15px;
          display: flex;
          gap: 10px;
          opacity: 0;
          animation: eyesBlink 4s ease-in-out infinite;
        }

        .eye-glow {
          width: 10px;
          height: 6px;
          background: #ff3333;
          border-radius: 50%;
          box-shadow: 0 0 8px #ff0000;
        }

        /* --- ANIMATIONS --- */
        @keyframes nightmareFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes vignettePulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }

        @keyframes batFlyLeftToRight {
          0% {
            transform: translateX(-100px) scale(0.6);
          }
          100% {
            transform: translateX(110vw) scale(0.8); 
          }
        }

        @keyframes batFlyRightToLeft {
          0% {
            transform: scaleX(-1) translateX(100px) scale(0.6);
          }
          100% {
            transform: scaleX(-1) translateX(-110vw) scale(0.8);
          }
        }

        @keyframes batFlyTopToBottom {
          0% {
            transform: rotate(90deg) translateX(-100px) scale(0.6);
          }
          100% {
            transform: rotate(90deg) translateX(110vh) scale(0.8);
          }
        }

        @keyframes batFlyBottomToTop {
          0% {
            transform: rotate(-90deg) translateX(-100px) scale(0.6);
          }
          100% {
            transform: rotate(-90deg) translateX(110vh) scale(0.8);
          }
        }

        /* Adds vertical unpredictability to the flight path */
        @keyframes batSwoop {
          0% { transform: translateY(0); }
          25% { transform: translateY(40px); }
          50% { transform: translateY(-20px); }
          75% { transform: translateY(20px); }
          100% { transform: translateY(0); }
        }

        @keyframes wingFlapLeft {
          0% { transform: rotate(10deg); }
          100% { transform: rotate(-40deg); }
        }

        @keyframes wingFlapRight {
          0% { transform: scaleX(-1) rotate(10deg); }
          100% { transform: scaleX(-1) rotate(-40deg); }
        }

        @keyframes eyesBlink {
          0% { opacity: 0; transform: scaleY(0.1); }
          10% { opacity: 0.8; transform: scaleY(1); }
          20% { opacity: 0.8; }
          22% { opacity: 0; } /* Quick blink */
          24% { opacity: 0.8; }
          80% { opacity: 0.8; transform: scaleY(1); }
          100% { opacity: 0; transform: scaleY(0.1); }
        }
      `}</style>
    </>
  );
};

export default NightmareOverlay;