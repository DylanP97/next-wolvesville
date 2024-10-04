"use client";

import { Button } from "@nextui-org/react";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import { fetchLogout } from "../../lib/fetch";
import { btnClassNames, getBtnClassNames } from "../../lib/styles";

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
          className={getBtnClassNames("w-40")}
          variant="solid"
          color="secondary"
          size="sm"
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
