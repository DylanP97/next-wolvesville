"use client";

import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

const GoBackBtn = () => {
  const { t } = useTranslation();

  return (
    <Button
      className="hover:animate-pulse hover:scale-[105%] transition-all text-white"
      color="secondary"
      variant="solid"
      onClick={() => window.history.back()}
    >
      {t("goback")}
    </Button>
  );
};

export default GoBackBtn;