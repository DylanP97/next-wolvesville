"use client";

import { Button } from "@nextui-org/react";
import { useAuth } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";

const LogoutBtn = () => {
  const { t } = useTranslation();
  const { isConnected, setAuthInfo, socket, setSocket } = useAuth();

  const logout = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/user/logout",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        setAuthInfo(null, null, false, null);
        socket.emit("logout");
        setSocket(null);
        document.location.assign("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {isConnected && (
        <Button
          variant="solid"
          color="secondary"
          className="hover:text-white"
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
