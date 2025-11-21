"use client";

import { Button, Tooltip } from "@nextui-org/react";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import { fetchLogout } from "../../lib/fetch";
import { btnClassNames, getBtnClassNames } from "../../lib/styles";
import LogoutIcon from "./icons/LogoutIcon";

const LogoutBtn = () => {
  const { isConnected, setAuthInfo, socket, setSocket, username, isGuest } = useAuth();
  const { t } = useTranslation();

  const logout = async () => {
    const response = await fetchLogout(username, isGuest);
    console.log(response)
    if (response.ok) {
      setAuthInfo(null, null, false, null);
      socket.emit("logout");
      setSocket(null);
      document.location.assign("/");
    }
  };

  return (
    <Tooltip
      content={t("logout")}
      color="secondary"
      variant="flat"
    >
      <Button
        isIconOnly
        size="sm"
        color="secondary"
        className={getBtnClassNames("w-10")}
        variant="solid"
        aria-label={t("logout")}
        onPress={() => logout()}
      >
        <LogoutIcon />
      </Button>
    </Tooltip>
  )
};

export default LogoutBtn;
