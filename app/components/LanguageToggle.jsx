"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@nextui-org/react";

function LanguageToggle() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const addAnimation = () => {
    document.body.classList.add("overlay-active");
    document.body.classList.remove("overlay-inactive");
  };

  const removeAnimation = () => {
    setTimeout(() => {
      document.body.classList.remove("overlay-active");
      document.body.classList.add("overlay-inactive");
    }, 1000);
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "fr" : "en";
    addAnimation();
    setTimeout(() => {
      i18n.changeLanguage(newLanguage);
      setCurrentLanguage(newLanguage);
    }, 1000);
    removeAnimation();
  };

  return (
    <Button
      isIconOnly
      color="primary"
      variant="ghost"
      aria-label={currentLanguage}
      onPress={toggleLanguage}
    >
      {currentLanguage === "en" ? "en" : "fr"}
    </Button>
  );
}

export default LanguageToggle;
