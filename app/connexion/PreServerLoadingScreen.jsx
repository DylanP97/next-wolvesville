"use client";

const { useTranslation } = require("react-i18next");
import { Spinner } from "@nextui-org/react";
import TipsRotator from "../homepage/TipsRotator";

const PreServerLoadingScreen = ({ countdown }) => {
    const { t } = useTranslation();

    return (
        <div className="z-20 w-full h-full text-center text-white flex flex-col justify-center items-center">
            <Spinner />
            <p>{t("intro.loading.main")}</p>
            <span className="text-center text-xs text-white">
                {t("intro.loading.info")}
            </span>
            <div className="text-center text-white text-xl mt-4">
                {countdown}
            </div>
            <TipsRotator />
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute -z-10 object-cover h-[100vh]"
                src="/animations/animatedVillage.mp4"
            />
        </div>
    )
};

export default PreServerLoadingScreen;