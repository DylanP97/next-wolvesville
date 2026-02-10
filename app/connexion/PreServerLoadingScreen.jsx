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

            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/85 z-10 pointer-events-none flex flex-col justify-center items-center pb-24">
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