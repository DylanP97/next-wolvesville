"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@nextui-org/react";
import { getBtnClassNames } from "../lib/styles";

function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language.substring(0, 2));

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "fr" : "en";
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  return (
    <Button
      size="sm"
      isIconOnly
      color="secondary"
      variant="solid"
      aria-label={t("change.language")}
      title={t("change.language")}
      onPress={toggleLanguage}
      className={getBtnClassNames("w-10")}
    >
      {currentLanguage === "en" ? "🇬🇧" : "🇫🇷"}
    </Button>
  );
}

export default LanguageToggle;
