"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
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
    <Tooltip content={t("change.language")} color="secondary" variant="faded">
      <span>
        <Button
          size="sm"
          isIconOnly
          color="secondary"
          variant="solid"
          aria-label={currentLanguage}
          onPress={toggleLanguage}
          className={getBtnClassNames("w-10")}
        >
          {currentLanguage === "en" ? "🇬🇧" : "🇫🇷"}
        </Button>
      </span>
    </Tooltip>
  );
}

export default LanguageToggle;
