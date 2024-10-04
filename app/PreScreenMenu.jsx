"use client";

import { useTranslation } from "react-i18next";
import HomePage from "./homepage/HomePage";
import Connexion from "./connexion/Connexion";
import Title from "./Title";
import { useEffect, useState } from "react";
import { defaultAvatar } from "./lib/utils";
import { useAuth } from "./providers/AuthProvider";
import { fetchGuestLogin } from "./lib/fetch";
import { Button, Spinner } from "@nextui-org/react";
import io from "socket.io-client"; // Add this import
import { btnClassNames, getBtnClassNames } from "./lib/styles";
import { useAnimation } from "./providers/AnimationProvider";

const PreScreenMenu = () => {
  const { t } = useTranslation();
  const [logOption, setLogOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthInfo, setSocket, setToken, username, setIsGuest } = useAuth();

  const handleGuestLogin = async () => {
    const data = await fetchGuestLogin();

    if (data) {
      setToken(data.token);
      setIsGuest(true);

      const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
        query: { token: data.token },
      });
      setSocket(newSocket);
      setAuthInfo(data.username, data.avatar, true, newSocket.id);
      newSocket.on("connect", () => {
        const user = {
          username: data.username,
          avatar: data.avatar,
          socketId: newSocket.id,
          token: data.token,
          isGuest: true,
        };
        newSocket.emit("sendNewConnectedUser", user);
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (logOption === "guestPlay") {
      setIsLoading(true);
      handleGuestLogin();
    }
  }, [logOption]);

  if (isLoading) {
    return (
      <div className="z-20 text-center text-white flex flex-col justify-center items-center m-2">
        <Spinner />
        <p>{t("intro.loading")}</p>
        <span className="text-center text-xs text-white">
          {t("intro.loading.info")}
        </span>
      </div>
    );
  }

  if (logOption === "guestPlay" && isLoading === false) {
    return (
      <HomePage username={username} isInRoom={false} avatar={defaultAvatar} />
    );
  } else if (logOption === "login" || logOption === "register") {
    console.log("logOption", logOption);
    return <Connexion logOption={logOption} />;
  } else {
    return (
      <div className="flex flex-col flex-grow justify-center items-center bg-black">
        <Title />
        <nav className="top-1/3 flex flex-col items-center py-4 w-full z-20">
          <Button
            className={getBtnClassNames("w-60")}
            color="primary"
            variant="shadow"
            onClick={() => setLogOption("guestPlay")}
          >
            {t("prescreen.guest")}
          </Button>
          <Button
            className={getBtnClassNames("w-60")}
            color="primary"
            onClick={() => setLogOption("login")}
            variant="shadow"
          >
            {t("prescreen.logIn")}
          </Button>
          <Button
            className={getBtnClassNames("w-60")}
            color="primary"
            onClick={() => setLogOption("register")}
            variant="shadow"
          >
            {t("prescreen.register")} 
          </Button>
        </nav>
      </div>
    );
  }
};

export default PreScreenMenu;
