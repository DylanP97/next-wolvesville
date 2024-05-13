"use client";

import { Button } from "@nextui-org/react";
import { useAuth } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import FullScreenToggle from "./FullScreenToggle";

const GeneralBtns = () => {
  const { t } = useTranslation();
  const { isConnected } = useAuth();

  return (
    <div className="flex flex-row justify-end items-center w-full border-b-0 border-white bg-black p-2 z-30 h-[10%] gap-2">
      <LanguageToggle />
      <FullScreenToggle />

      {isConnected && (
        <Button
          variant="ghost"
          color="primary"
          aria-label={t("logout")}
          onPress={() => document.location.assign("/")}
        >
          {t("logout")}
        </Button>
      )}
    </div>
  );
};

export default GeneralBtns;
