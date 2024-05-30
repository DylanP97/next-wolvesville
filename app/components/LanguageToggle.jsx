"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";

function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // const addAnimation = () => {
  //   document.body.classList.add("overlay-active");
  //   document.body.classList.remove("overlay-inactive");
  // };

  // const removeAnimation = () => {
  //   setTimeout(() => {
  //     document.body.classList.remove("overlay-active");
  //     document.body.classList.add("overlay-inactive");
  //   }, 1000);
  // };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "fr" : "en";
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  return (
    <Tooltip content={t("change.language")} color="secondary" variant="faded">
      <Button
        isIconOnly
        color="secondary"
        variant="solid"
        aria-label={currentLanguage}
        onPress={toggleLanguage}
        className="hover:text-white"
      >
        {currentLanguage === "en" ? "en" : "fr"}
      </Button>
    </Tooltip>
  );
}

export default LanguageToggle;
