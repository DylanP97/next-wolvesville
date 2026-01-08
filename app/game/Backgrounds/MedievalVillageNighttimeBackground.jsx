import React from 'react';

export default function MedievalVillageNighttimeBackground() {
    return (
        <div className="fixed w-full h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-blue-950 overflow-hidden pointer-events-none">
            {/* Moon */}
            <div className="absolute top-16 right-20 w-24 h-24 bg-slate-200 rounded-full shadow-2xl shadow-blue-300/40">
                <div className="absolute inset-2 bg-slate-100 rounded-full opacity-70"></div>
                {/* Moon craters */}
                <div className="absolute top-4 left-6 w-4 h-4 bg-slate-300 rounded-full opacity-40"></div>
                <div className="absolute top-10 left-12 w-3 h-3 bg-slate-300 rounded-full opacity-30"></div>
            </div>

            {/* Stars */}
            <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-24 left-40 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-16 left-60 w-1 h-1 bg-yellow-200 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-32 left-80 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-20 right-40 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-40 right-60 w-1 h-1 bg-yellow-200 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
            <div className="absolute top-12 right-80 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>

            {/* Dark Clouds */}
            <div className="absolute top-20 left-10 opacity-30 animate-[float_50s_linear_infinite]" style={{ animationDelay: '0s' }}>
                <div className="relative">
                    <div className="w-24 h-12 bg-slate-700 rounded-full"></div>
                    <div className="absolute top-2 left-6 w-32 h-14 bg-slate-700 rounded-full"></div>
                    <div className="absolute top-3 right-4 w-20 h-10 bg-slate-700 rounded-full"></div>
                </div>
            </div>

            {/* Distant Hills (darker) */}
            <svg className="absolute bottom-64 w-full h-48" viewBox="0 0 1200 200" preserveAspectRatio="none">
                <path d="M0,200 L0,100 Q300,40 600,80 Q900,120 1200,60 L1200,200 Z" fill="#1e3a2f" opacity="0.8" />
            </svg>
            <svg className="absolute bottom-48 w-full h-64" viewBox="0 0 1200 250" preserveAspectRatio="none">
                <path d="M0,250 L0,120 Q400,60 800,100 Q1000,120 1200,80 L1200,250 Z" fill="#2a4a3d" opacity="0.85" />
            </svg>
            <svg className="absolute bottom-32 w-full h-80" viewBox="0 0 1200 300" preserveAspectRatio="none">
                <path d="M0,300 L0,160 Q350,80 700,140 Q950,180 1200,100 L1200,300 Z" fill="#355a48" opacity="0.9" />
            </svg>

            {/* Medieval Village Houses with warm window lights */}
            {/* House 1 - with glowing windows */}
            <div className="absolute bottom-36 left-1/4 -translate-x-1/2">
                <svg width="80" height="90" viewBox="0 0 80 90">
                    <rect x="15" y="50" width="50" height="40" fill="#4a3428" />
                    <path d="M 10 50 L 40 25 L 70 50 Z" fill="#2d1f1a" />
                    <rect x="30" y="65" width="20" height="25" fill="#1a0f0a" rx="1" />
                    {/* Glowing windows */}
                    <rect x="22" y="57" width="8" height="8" fill="#ffb347" opacity="0.9" />
                    <rect x="50" y="57" width="8" height="8" fill="#ffb347" opacity="0.9" />
                    <rect x="22" y="57" width="8" height="8" fill="#ffb347" className="animate-pulse" />
                    <rect x="50" y="57" width="8" height="8" fill="#ffb347" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                </svg>
            </div>

            {/* House 2 - with glowing windows */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
                <svg width="110" height="120" viewBox="0 0 110 120">
                    <rect x="20" y="60" width="70" height="60" fill="#5c4539" />
                    <path d="M 10 60 L 55 25 L 100 60 Z" fill="#3a2820" />
                    <rect x="40" y="85" width="30" height="35" fill="#221510" rx="2" />
                    {/* Glowing windows */}
                    <rect x="28" y="70" width="12" height="12" fill="#ffb347" opacity="0.9" />
                    <rect x="70" y="70" width="12" height="12" fill="#ffb347" opacity="0.9" />
                    <rect x="28" y="70" width="12" height="12" fill="#ffb347" className="animate-pulse" />
                    <rect x="70" y="70" width="12" height="12" fill="#ffb347" className="animate-pulse" style={{ animationDelay: '0.7s' }} />
                </svg>
            </div>

            {/* House 3 - with glowing windows */}
            <div className="absolute bottom-28 right-1/4 translate-x-1/2">
                <svg width="100" height="110" viewBox="0 0 100 110">
                    <rect x="15" y="55" width="70" height="55" fill="#6b4f3d" />
                    <path d="M 5 55 L 50 25 L 95 55 Z" fill="#4a3428" />
                    <rect x="35" y="78" width="25" height="32" fill="#2d1f1a" rx="2" />
                    {/* Glowing windows */}
                    <rect x="25" y="65" width="10" height="10" fill="#ffb347" opacity="0.9" />
                    <rect x="65" y="65" width="10" height="10" fill="#ffb347" opacity="0.9" />
                    <rect x="25" y="65" width="10" height="10" fill="#ffb347" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <rect x="65" y="65" width="10" height="10" fill="#ffb347" className="animate-pulse" style={{ animationDelay: '0.9s' }} />
                </svg>
            </div>

            {/* Dark ground/grass */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-950 to-green-900"></div>

            {/* Dirt path (darker) */}
            <svg className="absolute bottom-0 w-full h-40" viewBox="0 0 1200 160" preserveAspectRatio="none">
                <path d="M 0,160 C 200,110 400,130 600,100 C 800,70 1000,100 1200,160 Z" fill="#3d2f24" opacity="0.8" />
            </svg>

            {/* Trees (dark silhouettes) */}
            <div className="absolute bottom-24 left-8">
                <svg width="60" height="100" viewBox="0 0 60 100">
                    <rect x="25" y="60" width="10" height="40" fill="#1a1410" />
                    <circle cx="30" cy="45" r="20" fill="#0f1f0e" />
                </svg>
            </div>
            <div className="absolute bottom-20 right-8">
                <svg width="70" height="110" viewBox="0 0 70 110">
                    <rect x="30" y="65" width="10" height="45" fill="#1a1410" />
                    <circle cx="35" cy="50" r="25" fill="#0a150a" />
                </svg>
            </div>

            {/* Custom Keyframes */}
            <style jsx>{`
                @keyframes float {
                    from { transform: translateX(-150px); }
                    to { transform: translateX(calc(100vw + 150px)); }
                }
            `}</style>
        </div>
    );
}