"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const TipsRotator = () => {
    const { t } = useTranslation();

    // Extract all tips from translation files
    const tips = [
        t("tips.1"),
        t("tips.2"),
        t("tips.3"),
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % tips.length);
        }, 6000); // Tip stays 6 seconds

        return () => clearInterval(interval);
    }, [tips.length]);

    return (
        <div className="animate-pulse w-full italic text-white text-center py-6 px-2 text-md md:text-lg">
            {tips[index]}{" ..."}
        </div>
    );
};

export default TipsRotator;
