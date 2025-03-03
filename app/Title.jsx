"use client";

const { useTranslation } = require("react-i18next");

const Title = () => {
  const { t } = useTranslation();

  return (
    <div className="m-4 z-10">
      <h1 className="bg-red-500 text-white text-center text-3xl font-bold mb-2">
        {t("intro.title")}
      </h1>
      <a
        target="_blank"
        className="text-white flex justify-center hover:underline pointer text-sm hover:text-primary"
        href="https://www.wolvesville.com"
      >
        {t("intro.ref")}
      </a>
    </div>
  );
};

export default Title;