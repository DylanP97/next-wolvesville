"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";

function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "fr" : "en";
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  return (
    <Tooltip content={t("change.language")} color="secondary" variant="faded">
      <Button
        size="sm"
        isIconOnly
        color="secondary"
        variant="solid"
        aria-label={currentLanguage}
        onPress={toggleLanguage}
        className="hover:text-white"
      >
        {currentLanguage === "en" ? "🇫🇷" : "🇬🇧"}
      </Button>
    </Tooltip>
  );
}

export default LanguageToggle;
