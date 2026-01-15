"use client";

import { useMemo } from "react";
import { useGame } from "../GameProvider";

const DeathOverlay = () => {
  const { clientPlayer } = useGame();

  // Show overlay only when player is dead
  const shouldShowOverlay = !clientPlayer?.isAlive;

  // Memoize animation values so they don't recalculate on every render
  const ghostAnimations = useMemo(() =>
    [...Array(2)].map((_, i) => ({
      left: `${15 + i * 18}%`,
      animationDelay: `${i * 1.5}s`,
      animationDuration: `${10 + Math.random() * 4}s`,
    })),
    []
  );

  const particleAnimations = useMemo(() =>
    [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    })),
    []
  );


  if (!shouldShowOverlay) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-20 death-overlay">
        {/* Desaturation and dark blue tint */}
        <div className="absolute inset-0 death-filter" />

        {/* Heavy vignette effect */}
        <div className="absolute inset-0 death-vignette" />

        {/* Floating ghosts */}
        {/* --- UPGRADED GHOSTS --- */}
        <div className="absolute inset-0 ghosts-container">
          {ghostAnimations.map((animation, i) => (
            <div
              key={i}
              className="ghost-wrapper"
              style={animation}
            >
              <div className="ghost-body">
                <div className="ghost-face">
                  <div className="eye left"><div className="pupil" /></div>
                  <div className="eye right"><div className="pupil" /></div>
                  <div className="mouth" />
                </div>
                <div className="ghost-arm left" />
                <div className="ghost-arm right" />
              </div>
            </div>
          ))}
        </div>

        {/* Ethereal particles */}
        <div className="absolute inset-0 ethereal-particles">
          {particleAnimations.map((animation, i) => (
            <div
              key={i}
              className="particle"
              style={animation}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .death-overlay {
          animation: deathFade 2s ease-in;
        }

        .death-filter {
          background: rgba(15, 25, 45, 0.36);
          backdrop-filter: blur(3px) grayscale(0.9) brightness(0.5) contrast(0.8);
          mix-blend-mode: multiply;
        }

        .death-vignette {
          background: radial-gradient(
            ellipse at center,
            transparent 20%,
            rgba(0, 10, 25, 0.04) 70%,
            rgba(0, 5, 15, 0.36) 100%
          );
        }

        /* --- NEW GHOST STYLES --- */
        .ghosts-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .ghost-wrapper {
          position: absolute;
          bottom: -150px;
          width: 100px;
          height: 140px;
          animation: ghostFloatUp linear infinite;
          /* Add a bobbing motion */
          transform-origin: center;
        }

        .ghost-body {
          position: relative;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 30%, #ffffff, #dceaff 40%, #aecbe8 100%);
          border-radius: 50% 50% 0 0;
          // box-shadow: 0 0 30px rgba(255, 255, 255, 0.3), inset -10px -10px 20px rgba(0,0,0,0.05);
          
          /* The spectral tail shape */
          clip-path: polygon(
            0% 100%, 
            0% 0%, 
            100% 0%, 
            100% 100%, 
            83% 85%, 
            66% 100%, 
            50% 85%, 
            33% 100%, 
            17% 85%
          );
          
          animation: ghostWobble 3s ease-in-out infinite alternate;
        }

        .ghost-face {
          position: absolute;
          top: 35px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 8px;
          opacity: 0.8;
        }

        .eye {
          position: absolute;
          top: 0;
          width: 16px;
          height: 22px;
          background: #1a2a40;
          border-radius: 50%;
          box-shadow: inset 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .eye.left { left: 28px; transform: rotate(-5deg); }
        .eye.right { right: 28px; transform: rotate(5deg); }

        .pupil {
          position: absolute;
          top: 4px;
          left: 4px;
          width: 5px;
          height: 5px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 2px white;
        }

        .mouth {
          margin-top: 25px; /* Push below eyes */
          width: 12px;
          height: 16px;
          background: #1a2a40;
          border-radius: 50%;
          opacity: 0.9;
        }

        .ghost-arm {
          position: absolute;
          top: 60px;
          width: 25px;
          height: 30px;
          background: #dceaff;
          border-radius: 15px;
          box-shadow: inset -2px -2px 5px rgba(0,0,0,0.05);
        }

        .ghost-arm.left {
          left: -10px;
          transform: rotate(40deg);
          animation: armWave 2s ease-in-out infinite alternate;
        }

        .ghost-arm.right {
          right: -10px;
          transform: rotate(-40deg);
          animation: armWave 2.5s ease-in-out infinite alternate-reverse;
        }

        /* --- ANIMATIONS --- */
        @keyframes deathFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes ghostFloatUp {
          0% {
            bottom: -150px;
            opacity: 0;
            transform: scale(0.8) translateX(0);
          }
          10% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% {
            bottom: 110%;
            opacity: 0;
            transform: scale(1) translateX(40px);
          }
        }

        @keyframes ghostWobble {
          0% { transform: translateY(0) rotate(-3deg); }
          100% { transform: translateY(-15px) rotate(3deg); }
        }

        @keyframes armWave {
          0% { transform: rotate(30deg) translateY(0); }
          100% { transform: rotate(50deg) translateY(-5px); }
        }

        /* Keep particle styles */
        .ethereal-particles { position: relative; width: 100%; height: 100%; }
        .particle {
          position: absolute;
          width: 3px; height: 3px;
          background: rgba(200, 230, 255, 0.7);
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(180, 220, 255, 0.9);
          animation: particleFloat linear infinite;
        }
        @keyframes particleFloat {
          0% { opacity: 0; transform: translateY(0) translateX(0); }
          10% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-80px) translateX(15px); }
        }
      `}</style>
    </>
  );
};

export default DeathOverlay;