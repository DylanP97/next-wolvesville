import React from 'react';

const RevealOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-lg">
      {/* Central glow layers */}
      <div className="glow glow-core"></div>
      <div className="glow glow-mid"></div>
      <div className="glow glow-outer"></div>
      
      {/* Light rays emanating from center */}
      <div className="ray ray-1"></div>
      <div className="ray ray-2"></div>
      <div className="ray ray-3"></div>
      <div className="ray ray-4"></div>
      <div className="ray ray-5"></div>
      <div className="ray ray-6"></div>
      
      {/* Shimmer particles */}
      <div className="sparkle sparkle-1"></div>
      <div className="sparkle sparkle-2"></div>
      <div className="sparkle sparkle-3"></div>
      <div className="sparkle sparkle-4"></div>
      <div className="sparkle sparkle-5"></div>
      <div className="sparkle sparkle-6"></div>
      <div className="sparkle sparkle-7"></div>
      <div className="sparkle sparkle-8"></div>
      
      {/* Final bright flash */}
      <div className="flash"></div>
      
      <style jsx>{`
        .glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          filter: blur(40px);
        }
        
        .glow-core {
          width: 100px;
          height: 100px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 1) 0%,
            rgba(77, 252, 77, 0.9) 30%,
            rgba(36, 251, 179, 0.6) 60%,
            transparent 100%
          );
          animation: glow-pulse-core 3s ease-in-out forwards;
        }
        
        .glow-mid {
          width: 200px;
          height: 200px;
          background: radial-gradient(
            circle,
            rgba(154, 36, 251, 0.8) 0%,
            rgba(14, 202, 86, 0.6) 40%,
            rgba(75, 158, 59, 0.4) 70%,
            transparent 100%
          );
          animation: glow-pulse-mid 3s ease-in-out forwards;
          animation-delay: 0.1s;
        }
        
        .glow-outer {
          width: 400px;
          height: 400px;
          background: radial-gradient(
            circle,
            rgba(126, 208, 255, 0.5) 0%,
            rgba(160, 60, 218, 0.71) 50%,
            transparent 100%
          );
          animation: glow-pulse-outer 3s ease-in-out forwards;
          animation-delay: 0.2s;
        }
        
        .ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 50%;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.9),
            rgba(252, 211, 77, 0.6),
            transparent
          );
          transform-origin: top center;
          filter: blur(2px);
          opacity: 0;
        }
        
        .ray-1 {
          transform: translate(-50%, 0) rotate(0deg);
          animation: ray-shine 3s ease-out forwards;
          animation-delay: 0.3s;
        }
        
        .ray-2 {
          transform: translate(-50%, 0) rotate(60deg);
          animation: ray-shine 3s ease-out forwards;
          animation-delay: 0.4s;
        }
        
        .ray-3 {
          transform: translate(-50%, 0) rotate(120deg);
          animation: ray-shine 3s ease-out forwards;
          animation-delay: 0.5s;
        }
        
        .ray-4 {
          transform: translate(-50%, 0) rotate(180deg);
          animation: ray-shine 3s ease-out forwards;
          animation-delay: 0.6s;
        }
        
        .ray-5 {
          transform: translate(-50%, 0) rotate(240deg);
          animation: ray-shine 3s ease-out forwards;
          animation-delay: 0.7s;
        }
        
        .ray-6 {
          transform: translate(-50%, 0) rotate(300deg);
          animation: ray-shine 3s ease-out forwards;
          animation-delay: 0.8s;
        }
        
        .sparkle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, rgba(255, 255, 255, 1), rgba(85, 255, 190, 0.8));
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(19, 79, 192, 1);
          opacity: 0;
        }
        
        .sparkle-1 {
          top: 20%;
          left: 30%;
          animation: sparkle-twinkle 3s ease-in-out forwards;
          animation-delay: 0.5s;
        }
        
        .sparkle-2 {
          top: 35%;
          left: 70%;
          animation: sparkle-twinkle 3s ease-in-out forwards;
          animation-delay: 0.7s;
        }
        
        .sparkle-3 {
          top: 60%;
          left: 25%;
          animation: sparkle-twinkle 3s ease-in-out forwards;
          animation-delay: 0.9s;
        }
        
        .sparkle-4 {
          top: 70%;
          left: 65%;
          animation: sparkle-twinkle 3s ease-in-out forwards;
          animation-delay: 1.1s;
        }
        
        .sparkle-5 {
          top: 45%;
          left: 50%;
          animation: sparkle-twinkle 3s ease-in-out forwards;
          animation-delay: 0.8s;
        }
        
        .sparkle-6 {
          top: 25%;
          left: 80%;
          animation: sparkle-twinkle 3s ease-in-out forwards;
          animation-delay: 1s;
        }
        
        .sparkle-7 {
          top: 75%;
          left: 40%;
          animation: sparkle-twinkle 3s ease-in-out forwards;
          animation-delay: 1.2s;
        }
        
        .sparkle-8 {
          top: 50%;
          left: 15%;
          animation: sparkle-twinkle 3s ease-in-out forwards;
          animation-delay: 0.6s;
        }
        
        .flash {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.7) 30%,
            transparent 70%
          );
          opacity: 0;
          animation: final-flash 3s ease-out forwards;
          animation-delay: 2.3s;
        }
        
        @keyframes glow-pulse-core {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          20% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          70% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(6);
            opacity: 0;
          }
        }
        
        @keyframes glow-pulse-mid {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          15% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          65% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(5);
            opacity: 0;
          }
        }
        
        @keyframes glow-pulse-outer {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          10% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          60% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
        
        @keyframes ray-shine {
          0% {
            opacity: 0;
            height: 0%;
          }
          30% {
            opacity: 1;
            height: 50%;
          }
          70% {
            opacity: 1;
            height: 80%;
          }
          100% {
            opacity: 0;
            height: 100%;
          }
        }
        
        @keyframes sparkle-twinkle {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
          40% {
            opacity: 0.7;
            transform: scale(1.2) rotate(360deg);
          }
          60% {
            opacity: 1;
            transform: scale(0.9) rotate(540deg);
          }
          80% {
            opacity: 0.8;
            transform: scale(1.1) rotate(720deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(900deg);
          }
        }
        
        @keyframes final-flash {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
          }
        }
      `}</style>
    </div>
  );
};

export default RevealOverlay;