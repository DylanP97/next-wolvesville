import React from 'react';

export default function MedievalVillageDaytimeBackground() {
    return (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 overflow-hidden pointer-events-none ">
            {/* Sun */}
            <div className="absolute top-16 right-20 w-24 h-24 bg-yellow-300 rounded-full shadow-2xl shadow-yellow-400/60 animate-pulse-slow">
                <div className="absolute inset-2 bg-yellow-200 rounded-full opacity-70"></div>
            </div>

            {/* Clouds */}
            <div className="absolute top-20 left-10 animate-[float_40s_linear_infinite]" style={{ animationDelay: '0s' }}>
                <div className="relative">
                    <div className="w-24 h-12 bg-white rounded-full opacity-90"></div>
                    <div className="absolute top-2 left-6 w-32 h-14 bg-white rounded-full opacity-90"></div>
                    <div className="absolute top-3 right-4 w-20 h-10 bg-white rounded-full opacity-90"></div>
                </div>
            </div>
            <div className="absolute top-32 right-32 animate-[float_50s_linear_infinite]" style={{ animationDelay: '-20s' }}>
                <div className="relative">
                    <div className="w-20 h-10 bg-white rounded-full opacity-80"></div>
                    <div className="absolute top-1 left-4 w-28 h-12 bg-white rounded-full opacity-80"></div>
                    <div className="absolute top-2 right-2 w-16 h-9 bg-white rounded-full opacity-80"></div>
                </div>
            </div>

            {/* Distant Hills (more layered for depth) */}
            <svg className="absolute bottom-64 w-full h-48" viewBox="0 0 1200 200" preserveAspectRatio="none">
                <path d="M0,200 L0,100 Q300,40 600,80 Q900,120 1200,60 L1200,200 Z" fill="#8cb369" opacity="0.7" />
            </svg>
            <svg className="absolute bottom-48 w-full h-64" viewBox="0 0 1200 250" preserveAspectRatio="none">
                <path d="M0,250 L0,120 Q400,60 800,100 Q1000,120 1200,80 L1200,250 Z" fill="#7ba05d" opacity="0.8" />
            </svg>
            <svg className="absolute bottom-32 w-full h-80" viewBox="0 0 1200 300" preserveAspectRatio="none">
                <path d="M0,300 L0,160 Q350,80 700,140 Q950,180 1200,100 L1200,300 Z" fill="#6a8c4f" opacity="0.9" />
            </svg>

            {/* Medieval Village Houses - strategically placed on the 'ground' */}
            {/* House 1 - Smaller, further back */}
            <div className="absolute bottom-36 left-1/4 -translate-x-1/2 z-10">
                <svg width="80" height="90" viewBox="0 0 80 90">
                    <rect x="15" y="50" width="50" height="40" fill="#9f6f52" /> {/* Body */}
                    <path d="M 10 50 L 40 25 L 70 50 Z" fill="#6f4f3e" /> {/* Roof */}
                    <rect x="30" y="65" width="20" height="25" fill="#4a2e23" rx="1" /> {/* Door */}
                    <rect x="22" y="57" width="8" height="8" fill="#a7e0ff" stroke="#4a2e23" strokeWidth="1" /> {/* Window */}
                    <rect x="50" y="57" width="8" height="8" fill="#a7e0ff" stroke="#4a2e23" strokeWidth="1" /> {/* Window */}
                </svg>
            </div>

            {/* House 2 - Medium size */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
                <svg width="110" height="120" viewBox="0 0 110 120">
                    <rect x="20" y="60" width="70" height="60" fill="#ae7f5c" /> {/* Body */}
                    <path d="M 10 60 L 55 25 L 100 60 Z" fill="#7a5540" /> {/* Roof */}
                    <rect x="40" y="85" width="30" height="35" fill="#5c392b" rx="2" /> {/* Door */}
                    <rect x="28" y="70" width="12" height="12" fill="#a7e0ff" stroke="#5c392b" strokeWidth="1" /> {/* Window */}
                    <rect x="70" y="70" width="12" height="12" fill="#a7e0ff" stroke="#5c392b" strokeWidth="1" /> {/* Window */}
                </svg>
            </div>

            {/* House 3 - Slightly larger, foreground */}
            <div className="absolute bottom-28 right-1/4 translate-x-1/2 z-30">
                <svg width="100" height="110" viewBox="0 0 100 110">
                    <rect x="15" y="55" width="70" height="55" fill="#c49466" /> {/* Body */}
                    <path d="M 5 55 L 50 25 L 95 55 Z" fill="#8f674d" /> {/* Roof */}
                    <rect x="35" y="78" width="25" height="32" fill="#6b4432" rx="2" /> {/* Door */}
                    <rect x="25" y="65" width="10" height="10" fill="#a7e0ff" stroke="#6b4432" strokeWidth="1" /> {/* Window */}
                    <rect x="65" y="65" width="10" height="10" fill="#a7e0ff" stroke="#6b4432" strokeWidth="1" /> {/* Window */}
                </svg>
            </div>

            {/* Ground/grass in foreground */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-700 to-green-600"></div>

            {/* Dirt path (more integrated into the ground) */}
            <svg className="absolute bottom-0 w-full h-40" viewBox="0 0 1200 160" preserveAspectRatio="none">
                <path d="M 0,160 C 200,110 400,130 600,100 C 800,70 1000,100 1200,160 Z" fill="#a0826d" opacity="0.8" />
            </svg>

            {/* Trees (more integrated, in front and behind some houses) */}
            <div className="absolute bottom-24 left-8 z-20">
                <svg width="60" height="100" viewBox="0 0 60 100">
                    <rect x="25" y="60" width="10" height="40" fill="#654321" />
                    <circle cx="30" cy="45" r="20" fill="#3d6b1f" />
                </svg>
            </div>
            <div className="absolute bottom-20 right-8 z-30">
                <svg width="70" height="110" viewBox="0 0 70 110">
                    <rect x="30" y="65" width="10" height="45" fill="#654321" />
                    <circle cx="35" cy="50" r="25" fill="#2d5016" />
                </svg>
            </div>

            {/* Custom Keyframes */}
            <style jsx>{`
        @keyframes float {
          from { transform: translateX(-150px); }
          to { transform: translateX(calc(100vw + 150px)); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.95; }
        }
      `}</style>
        </div>
    );
}