"use client";

import { useTranslation } from "react-i18next";
import GeneralBtns from "../general-btns/GeneralBtns";
import TipsRotator from "../homepage/TipsRotator";

const PreServerLoadingScreen = ({ countdown }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black/40 backdrop-blur-md overflow-hidden">
            <GeneralBtns />
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-screen w-full object-cover z-0"
                src="/animations/animatedVillage.webm"
            />

            {/* Floating embers with glowing trails */}
            <div className="absolute inset-0 pointer-events-none z-5">
                {[...Array(14)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bottom-0 w-2 h-2 bg-white rounded-full opacity-80 animate-ember shadow-[0_0_12px_4px_rgba(255,255,255,0.7)]"
                        style={{
                            left: `${5 + Math.random() * 90}%`,
                            animationDelay: `${Math.random() * 8}s`,
                            animationDuration: `${4 + Math.random() * 8}s`,
                        }}
                    >
                        <div className="absolute inset-0 rounded-full bg-white blur-md opacity-60 scale-150" />
                    </div>
                ))}
            </div>

            {/* Custom CSS for smooth floating circles */}
            <style jsx>{`
                @keyframes floatSmooth1 {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.2;
                    }
                    25% {
                        transform: translate(-130px, 60px) scale(1.1);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translate(150px, -20px) scale(0.9);
                        opacity: 0.25;
                    }
                    75% {
                        transform: translate(-20px, -80px) scale(1.05);
                        opacity: 0.15;
                    }
                }
                
                @keyframes floatSmooth2 {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.3;
                    }
                    25% {
                        transform: translate(140px, -30px) scale(0.75);
                        opacity: 0.25;
                    }
                    50% {
                        transform: translate(-20px, -60px) scale(1.4);
                        opacity: 0.35;
                    }
                    75% {
                        transform: translate(80px, -25px) scale(0.9);
                        opacity: 0.2;
                    }
                }
                
                .float-circle-1 {
                    animation: floatSmooth1 8s ease-in-out infinite;
                }
                
                .float-circle-2 {
                    animation: floatSmooth2 10s ease-in-out infinite;
                }
            `}</style>

            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/85 z-10 pointer-events-none flex flex-col justify-center items-center pb-24">
                {/* Animated circles with smooth floating motion */}
                <div className="absolute bottom-12 right-8 float-circle-1">
                    <div className="w-32 h-32 rounded-full bg-purple-500/40 animate-ping"></div>
                </div>
                <div className="absolute top-16 left-12 float-circle-2">
                    <div className="w-24 h-24 rounded-full bg-purple-500 animate-ping"></div>
                </div>

                {/* Content */}
                <div className="text-center space-y-4 mt-8 z-20">
                    <p className="text-white text-2xl font-bold animate-pulse tracking-wide">
                        {t("prescreen.loading")}
                    </p>

                    <p className="text-sm italic text-slate-300 max-w-xs">
                        {t("prescreen.serverLoading")}
                    </p>

                    {/* Countdown circle */}
                    <div className="relative w-24 h-24 mx-auto mt-6">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="44"
                                stroke="currentColor"
                                strokeWidth="5"
                                fill="none"
                                className="text-slate-700/80"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="44"
                                stroke="currentColor"
                                strokeWidth="5"
                                fill="none"
                                strokeDasharray={276}
                                strokeDashoffset={276 - (276 * countdown) / 60}
                                className="text-blue-500 transition-all duration-1000 ease-linear"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-extrabold text-white drop-shadow-lg">
                                {countdown}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 px-5 z-30">
                    <TipsRotator />
                </div>
            </div>
        </div>
    );
};

export default PreServerLoadingScreen;