"use client";

import { useTranslation } from "react-i18next";

const Title = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-4 z-10">
      <h1 className="text-center font-wolf relative overflow-hidden flex flex-col animated-text">
        <span className="text-[16px] md:text-[28px]">
          {t("intro.title")}
        </span>
        <span className="text-[50px] md:text-[80px] leading-tight">
          {t("intro.title2")}
        </span>
      </h1>

      <style jsx>{`
        .animated-text {
          /* Bright gradient for visibility against dark background */
          background: linear-gradient(
            90deg,
            rgba(255, 80, 80, 1),
            rgba(255, 120, 50, 1),
            rgba(255, 200, 60, 1),
            rgba(255, 100, 70, 1)
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          /* Glow effect for extra visibility */
          filter: drop-shadow(0 0 8px rgba(255, 100, 50, 0.6));
          /* Animation douce */
          animation: shimmer-text 4s ease-in-out infinite;
        }

        @keyframes shimmer-text {
          0% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Title;
