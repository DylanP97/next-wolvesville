"use client";

import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import Home, { useToRender } from "../page";

const GoBackBtn = () => {
  const { t } = useTranslation();
  const { setActiveComponent, activeComponent } = useToRender();

  return (
    <Button
      className="hover:animate-pulse hover:scale-[105%] w-60 transition-all"
      color="secondary"
      variant="solid"
      onClick={() =>
        setActiveComponent(
          activeComponent.componentToReturn ? (
            activeComponent.componentToReturn
          ) : (
            <Home />
          )
        )
      }
    >
      {t("goback")}
    </Button>
  );
};

export default GoBackBtn;
