import React from 'react';

export default function MedievalVillageVotetimeBackground() {
    return (
        <div className="fixed w-full h-screen bg-gradient-to-b from-orange-400 via-amber-300 to-orange-200 overflow-hidden pointer-events-none">
            {/* Setting Sun */}
            <div className="absolute top-32 right-16 w-28 h-28 bg-orange-500 rounded-full shadow-2xl shadow-orange-600/60 animate-pulse-slow">
                <div className="absolute inset-2 bg-orange-400 rounded-full opacity-70"></div>
                <div className="absolute inset-4 bg-yellow-300 rounded-full opacity-50"></div>
            </div>

            {/* Sunset Clouds (orange/pink tinted) */}
            <div className="absolute top-24 left-10 animate-[float_45s_linear_infinite]" style={{ animationDelay: '0s' }}>
                <div className="relative">
                    <div className="w-24 h-12 bg-orange-200 rounded-full opacity-80"></div>
                    <div className="absolute top-2 left-6 w-32 h-14 bg-pink-200 rounded-full opacity-80"></div>
                    <div className="absolute top-3 right-4 w-20 h-10 bg-orange-100 rounded-full opacity-80"></div>
                </div>
            </div>
            <div className="absolute top-36 right-32 animate-[float_55s_linear_infinite]" style={{ animationDelay: '-20s' }}>
                <div className="relative">
                    <div className="w-20 h-10 bg-pink-200 rounded-full opacity-70"></div>
                    <div className="absolute top-1 left-4 w-28 h-12 bg-orange-200 rounded-full opacity-70"></div>
                    <div className="absolute top-2 right-2 w-16 h-9 bg-amber-200 rounded-full opacity-70"></div>
                </div>
            </div>

            {/* Distant Hills (warm tones) */}
            <svg className="absolute bottom-64 w-full h-48" viewBox="0 0 1200 200" preserveAspectRatio="none">
                <path d="M0,200 L0,100 Q300,40 600,80 Q900,120 1200,60 L1200,200 Z" fill="#a67c52" opacity="0.7" />
            </svg>
            <svg className="absolute bottom-48 w-full h-64" viewBox="0 0 1200 250" preserveAspectRatio="none">
                <path d="M0,250 L0,120 Q400,60 800,100 Q1000,120 1200,80 L1200,250 Z" fill="#8d6e47" opacity="0.8" />
            </svg>
            <svg className="absolute bottom-32 w-full h-80" viewBox="0 0 1200 300" preserveAspectRatio="none">
                <path d="M0,300 L0,160 Q350,80 700,140 Q950,180 1200,100 L1200,300 Z" fill="#7a5e3d" opacity="0.9" />
            </svg>

            {/* Medieval Village Houses (silhouettes with warm glow) */}
            {/* House 1 */}
            <div className="absolute bottom-36 left-1/4 -translate-x-1/2">
                <svg width="80" height="90" viewBox="0 0 80 90">
                    <rect x="15" y="50" width="50" height="40" fill="#6b4f3d" />
                    <path d="M 10 50 L 40 25 L 70 50 Z" fill="#4a3428" />
                    <rect x="30" y="65" width="20" height="25" fill="#2d1f1a" rx="1" />
                    {/* Windows with warm glow */}
                    <rect x="22" y="57" width="8" height="8" fill="#ff9a4d" opacity="0.8" />
                    <rect x="50" y="57" width="8" height="8" fill="#ff9a4d" opacity="0.8" />
                </svg>
            </div>

            {/* House 2 */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
                <svg width="110" height="120" viewBox="0 0 110 120">
                    <rect x="20" y="60" width="70" height="60" fill="#7d5a45" />
                    <path d="M 10 60 L 55 25 L 100 60 Z" fill="#5c4233" />
                    <rect x="40" y="85" width="30" height="35" fill="#3a2820" rx="2" />
                    {/* Windows with warm glow */}
                    <rect x="28" y="70" width="12" height="12" fill="#ff9a4d" opacity="0.8" />
                    <rect x="70" y="70" width="12" height="12" fill="#ff9a4d" opacity="0.8" />
                </svg>
            </div>

            {/* House 3 */}
            <div className="absolute bottom-28 right-1/4 translate-x-1/2">
                <svg width="100" height="110" viewBox="0 0 100 110">
                    <rect x="15" y="55" width="70" height="55" fill="#8e6650" />
                    <path d="M 5 55 L 50 25 L 95 55 Z" fill="#6b4f3d" />
                    <rect x="35" y="78" width="25" height="32" fill="#4a3428" rx="2" />
                    {/* Windows with warm glow */}
                    <rect x="25" y="65" width="10" height="10" fill="#ff9a4d" opacity="0.8" />
                    <rect x="65" y="65" width="10" height="10" fill="#ff9a4d" opacity="0.8" />
                </svg>
            </div>

            {/* Ground/grass (warm evening tones) */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-amber-800 to-amber-700"></div>

            {/* Dirt path */}
            <svg className="absolute bottom-0 w-full h-40" viewBox="0 0 1200 160" preserveAspectRatio="none">
                <path d="M 0,160 C 200,110 400,130 600,100 C 800,70 1000,100 1200,160 Z" fill="#8d6e47" opacity="0.8" />
            </svg>

            {/* Trees (darker silhouettes) */}
            <div className="absolute bottom-24 left-8">
                <svg width="60" height="100" viewBox="0 0 60 100">
                    <rect x="25" y="60" width="10" height="40" fill="#4a3428" />
                    <circle cx="30" cy="45" r="20" fill="#2d4a1a" />
                </svg>
            </div>
            <div className="absolute bottom-20 right-8">
                <svg width="70" height="110" viewBox="0 0 70 110">
                    <rect x="30" y="65" width="10" height="45" fill="#4a3428" />
                    <circle cx="35" cy="50" r="25" fill="#1f3a12" />
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