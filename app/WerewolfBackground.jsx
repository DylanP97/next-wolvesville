import React from 'react';
import { memo } from 'react';

const WerewolfBackground = memo(() => {
    return (
        <div className="absolute top-0 w-full h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
            {/* Stars */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full animate-pulse"
                        style={{
                            width: Math.random() * 3 + 1 + 'px',
                            height: Math.random() * 3 + 1 + 'px',
                            top: Math.random() * 70 + '%',
                            left: Math.random() * 100 + '%',
                            animationDelay: Math.random() * 3 + 's',
                            animationDuration: Math.random() * 3 + 2 + 's'
                        }}
                    />
                ))}
            </div>

            {/* Moon */}
            <div className="absolute top-20 right-1/4 w-40 h-40 bg-yellow-100 rounded-full shadow-2xl shadow-yellow-200/50 animate-pulse"
                style={{ animationDuration: '4s' }}>
                <div className="absolute inset-2 bg-yellow-50 rounded-full opacity-70"></div>
                <div className="absolute top-8 left-6 w-8 h-8 bg-gray-200 rounded-full opacity-30"></div>
                <div className="absolute top-16 right-8 w-12 h-12 bg-gray-200 rounded-full opacity-20"></div>
            </div>

            {/* Clouds */}
            <div className="absolute top-32 left-0 w-full h-32">
                <div className="absolute top-0 left-0 w-96 h-20 bg-gray-900/40 rounded-full blur-xl animate-[slide_30s_linear_infinite]" />
                <div className="absolute top-10 right-0 w-80 h-16 bg-gray-900/30 rounded-full blur-xl animate-[slide_40s_linear_infinite]"
                    style={{ animationDelay: '-15s' }} />
            </div>

            {/* Forest Silhouette */}
            <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-black to-transparent">
                <svg className="absolute bottom-0 w-full h-64" viewBox="0 0 1200 300" preserveAspectRatio="none">
                    <path d="M0,300 L0,200 Q50,150 100,180 Q150,210 200,160 Q250,110 300,150 L300,300 Z" fill="#0a0a0a" opacity="0.9" />
                    <path d="M250,300 L250,180 Q300,130 350,170 Q400,210 450,160 Q500,110 550,170 L550,300 Z" fill="#0a0a0a" opacity="0.9" />
                    <path d="M500,300 L500,190 Q550,140 600,180 Q650,220 700,170 Q750,120 800,180 L800,300 Z" fill="#0a0a0a" opacity="0.9" />
                    <path d="M750,300 L750,200 Q800,150 850,190 Q900,230 950,180 Q1000,130 1050,190 Q1100,230 1150,200 L1200,220 L1200,300 Z" fill="#0a0a0a" opacity="0.9" />
                </svg>
            </div>

            {/* Mist effect at bottom */}
            <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-gray-900/60 to-transparent backdrop-blur-sm" />

            <style jsx>{`
        @keyframes slide {
          from { transform: translateX(-100%); }
          to { transform: translateX(200%); }
        }
        
        @keyframes howl {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
      `}</style>
        </div>
    );
});

WerewolfBackground.displayName = 'WerewolfBackground';

export default WerewolfBackground;