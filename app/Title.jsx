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
          /* texte blanc de base */
          color: white;
          /* Gradient shimmer uniquement visible dans le texte */
          background: linear-gradient(
            90deg,
            rgba(199, 9, 9, 0.4),
            rgba(228, 27, 27, 0.36),
            rgba(255, 195, 30, 0.47),
            rgba(94, 8, 8, 0.37)
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
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
