"use client";

const { useTranslation } = require("react-i18next");
import { Spinner } from "@nextui-org/react";
import TipsRotator from "../homepage/TipsRotator";


const PreServerLoadingScreen = ({ countdown }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black/40 backdrop-blur-md">
            <div className="relative">
                {/* Animated circles behind spinner */}
                <div className="absolute -bottom-10 right-0 animate-ping opacity-20">
                    <div className="w-32 h-32 rounded-full bg-blue-500"></div>
                </div>
                <div className="absolute -top-20 left-10 animate-ping opacity-30">
                    <div className="w-24 h-24 rounded-full bg-blue-500/50"></div>
                </div>

                {/* Main spinner container */}
                <div className="flex flex-col justify-center items-center relative z-10 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-8 rounded-3xl border border-slate-600/50 shadow-2xl backdrop-blur-lg overflow-hidden relative">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 m-auto h-full max-h-[400px] object-cover z-0"
                        src="/animations/animatedVillage.mp4"
                    />
                    <Spinner size="lg" color="primary" className="mb-4" />

                    <div className="text-center space-y-3 mt-6 z-20">
                        <p className="text-white text-xl font-semibold animate-pulse">
                            Chargement en cours...
                        </p>
                        <p className="text-slate-300 text-sm">
                            Préparation du serveur
                        </p>

                        {/* Countdown with circular progress */}
                        <div className="relative w-20 h-20 mx-auto mt-4">
                            <svg className="transform -rotate-90 w-20 h-20">
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="36"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    className="text-slate-700"
                                />
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="36"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={226}
                                    strokeDashoffset={226 - (226 * countdown) / 50}
                                    className="text-blue-500 transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">{countdown}</span>
                            </div>
                        </div>

                        <div className="mt-4 text-xs text-slate-400 z-30">
                            <p>
                                Le serveur se réveille après une période d'inactivité...
                            </p>
                            <p>{t("intro.loading.main")}</p>
                            {/* <span className="text-center text-xs italic text-white-400">
                                {t("intro.loading.info")}
                            </span> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default PreServerLoadingScreen;