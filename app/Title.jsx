"use client";

import { useTranslation } from "react-i18next";

const Title = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-4 z-10">
      <h1 className="animate-pulse text-center font-wolf relative overflow-hidden flex flex-col animated-text">
        <span className="text-[20px] md:text-[40px]">
          {t("intro.title")}
        </span>
        <span className="text-[70px] md:text-[120px]">
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
            white,
            #5b09c7ff,
            #0a0407ff,
            white
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
