"use client";

const { useTranslation } = require("react-i18next");
import { Spinner } from "@nextui-org/react";

const PreServerLoadingScreen = ({ countdown }) => {
    const { t } = useTranslation();

    return (
        <div className="z-20 w-full h-full text-center text-white flex flex-col justify-center items-center m-2">
            <Spinner />
            <p>{t("intro.loading.main")}</p>
            <span className="text-center text-xs text-white">
                {t("intro.loading.info")}
            </span>
            <div className="text-center text-white text-xl mt-4">
                {countdown}
            </div>
        </div>
    )
};

export default PreServerLoadingScreen;