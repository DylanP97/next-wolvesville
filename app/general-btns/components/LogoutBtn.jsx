"use client";

import { Button } from "@nextui-org/react";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import { fetchLogout } from "../../lib/fetch";

const LogoutBtn = () => {
  const { isConnected, setAuthInfo, socket, setSocket } = useAuth();
  const { t } = useTranslation();

  const logout = async () => {
    const response = await fetchLogout();
    if (response.ok) {
      setAuthInfo(null, null, false, null);
      socket.emit("logout");
      setSocket(null);
      document.location.assign("/");
    }
  };

  return (
    <>
      {isConnected && (
        <Button
          variant="solid"
          color="secondary"
          size="sm"
          className="hover:text-white text-xs"
          aria-label={t("logout")}
          onPress={() => logout()}
        >
          {t("logout")}
        </Button>
      )}
    </>
  );
};

export default LogoutBtn;
