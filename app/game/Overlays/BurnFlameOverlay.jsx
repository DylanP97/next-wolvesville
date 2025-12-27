import React from 'react';

const BurnFlameOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-lg" style={{ filter: 'grayscale(0) blur(0px)' }}>
      {/* Multiple flame layers for depth */}
      <div className="flame flame-1"></div>
      <div className="flame flame-2"></div>
      <div className="flame flame-3"></div>
      <div className="flame flame-4"></div>
      
      {/* Ember particles */}
      <div className="ember ember-1"></div>
      <div className="ember ember-2"></div>
      <div className="ember ember-3"></div>
      <div className="ember ember-4"></div>
      <div className="ember ember-5"></div>
      
      <style jsx>{`
        .flame {
          position: absolute;
          bottom: -20%;
          width: 100%;
          height: 120%;
          background: linear-gradient(
            to top,
            rgba(255, 100, 0, 0.9) 0%,
            rgba(255, 150, 0, 0.7) 30%,
            rgba(255, 200, 0, 0.5) 50%,
            rgba(255, 220, 100, 0.3) 70%,
            transparent 100%
          );
          border-radius: 50% 50% 0 0;
          transform-origin: bottom center;
          filter: blur(8px);
        }
        
        .flame-1 {
          animation: flicker1 0.8s ease-in-out infinite;
          opacity: 0.9;
        }
        
        .flame-2 {
          animation: flicker2 1s ease-in-out infinite;
          opacity: 0.7;
          left: -10%;
        }
        
        .flame-3 {
          animation: flicker3 0.9s ease-in-out infinite;
          opacity: 0.8;
          left: 10%;
        }
        
        .flame-4 {
          animation: flicker4 1.1s ease-in-out infinite;
          opacity: 0.6;
          filter: blur(12px);
        }
        
        .ember {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(255, 150, 0, 1), rgba(255, 80, 0, 0.8));
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(255, 100, 0, 0.8);
        }
        
        .ember-1 {
          bottom: 10%;
          left: 20%;
          animation: rise1 2s ease-out infinite;
        }
        
        .ember-2 {
          bottom: 5%;
          left: 70%;
          animation: rise2 2.5s ease-out infinite;
          animation-delay: 0.3s;
        }
        
        .ember-3 {
          bottom: 15%;
          left: 50%;
          animation: rise3 2.2s ease-out infinite;
          animation-delay: 0.6s;
        }
        
        .ember-4 {
          bottom: 8%;
          left: 35%;
          animation: rise4 2.8s ease-out infinite;
          animation-delay: 0.9s;
        }
        
        .ember-5 {
          bottom: 12%;
          left: 80%;
          animation: rise5 2.4s ease-out infinite;
          animation-delay: 1.2s;
        }
        
        @keyframes flicker1 {
          0%, 100% {
            transform: scaleY(1) scaleX(0.95);
            opacity: 0.9;
          }
          25% {
            transform: scaleY(1.1) scaleX(1.05);
            opacity: 1;
          }
          50% {
            transform: scaleY(0.95) scaleX(0.9);
            opacity: 0.85;
          }
          75% {
            transform: scaleY(1.05) scaleX(1);
            opacity: 0.95;
          }
        }
        
        @keyframes flicker2 {
          0%, 100% {
            transform: scaleY(0.95) scaleX(1) translateX(0);
            opacity: 0.7;
          }
          33% {
            transform: scaleY(1.1) scaleX(0.9) translateX(-5px);
            opacity: 0.8;
          }
          66% {
            transform: scaleY(0.9) scaleX(1.05) translateX(5px);
            opacity: 0.6;
          }
        }
        
        @keyframes flicker3 {
          0%, 100% {
            transform: scaleY(1) scaleX(0.9) translateX(0);
            opacity: 0.8;
          }
          40% {
            transform: scaleY(1.05) scaleX(1.1) translateX(5px);
            opacity: 0.9;
          }
          80% {
            transform: scaleY(0.95) scaleX(0.95) translateX(-3px);
            opacity: 0.7;
          }
        }
        
        @keyframes flicker4 {
          0%, 100% {
            transform: scaleY(0.9) scaleX(1.1);
            opacity: 0.6;
          }
          50% {
            transform: scaleY(1.15) scaleX(0.85);
            opacity: 0.7;
          }
        }
        
        @keyframes rise1 {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(-10px) scale(0.3);
            opacity: 0;
          }
        }
        
        @keyframes rise2 {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-120px) translateX(15px) scale(0.2);
            opacity: 0;
          }
        }
        
        @keyframes rise3 {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-110px) translateX(-8px) scale(0.25);
            opacity: 0;
          }
        }
        
        @keyframes rise4 {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-130px) translateX(12px) scale(0.15);
            opacity: 0;
          }
        }
        
        @keyframes rise5 {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-105px) translateX(-15px) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BurnFlameOverlay;