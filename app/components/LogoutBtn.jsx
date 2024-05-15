"use client";

import { Button } from "@nextui-org/react";
import { useAuth } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";

const LogoutBtn = () => {
    const { t } = useTranslation();
    const { isConnected } = useAuth();
  
  return (
    <>
      {isConnected && (
        <Button
          variant="ghost"
          color="secondary"
          className="hover:text-white"
          aria-label={t("logout")}
          onPress={() => document.location.assign("/")}
        >
          {t("logout")}
        </Button>
      )}
    </>
  );
};

export default LogoutBtn;
