"use client";

import { useTranslation } from "react-i18next";
import HomePage from "../homepage/HomePage";
import Connexion from "./Connexion";
import Title from "./Title";
import { useEffect, useState } from "react";
import { defaultAvatar } from "../lib/utils";
import { useAuth } from "../providers/AuthProvider";
import { fetchGuestLogin } from "../lib/fetch";
import { Spinner } from "@nextui-org/react";
import io from "socket.io-client"; // Add this import

const PreScreenMenu = () => {
  const { t } = useTranslation();
  const [logOption, setLogOption] = useState("");
  const { setAuthInfo, setSocket, setToken, username, setIsGuest } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = async () => {
    setIsLoading(true);
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
      handleGuestLogin();
    }
  }, [logOption]);

  if (isLoading) {
    return (
      <div className="z-20 text-center text-white flex flex-col justify-center items-center m-2">
        <Spinner />
        <p>{t("intro.loading")}</p>
        <span className="text-center text-xs text-gray-200">
          {t("intro.loading.info")}
        </span>
      </div>
    );
  }

  if (logOption === "guestPlay") {
    return (
      <HomePage username={username} isInRoom={false} avatar={defaultAvatar} />
    );
  } else if (logOption === "login" || logOption === "register") {
    return <Connexion logOption={logOption} />;
  } else {
    return (
      <div className="flex flex-col flex-grow justify-center items-center bg-black">
        <Title />
        <nav className="top-1/3 flex flex-col items-center py-4 w-full z-20">
          <div
            onClick={() => setLogOption("guestPlay")}
            className="w-60 h-10 z-20 p-2 my-2 rounded-3xl bg-primary text-sm text-center text-primary-foreground flex justify-center items-center hover:font-bold hover:scale-[105%] transition-all"
          >
            Play as Guest
          </div>
          <div
            onClick={() => setLogOption("login")}
            className="w-60 h-10 z-20 p-2 my-2 rounded-3xl bg-primary text-sm text-center text-primary-foreground flex justify-center items-center hover:font-bold hover:scale-[105%] transition-all"
          >
            Log in with your account
          </div>
          <div
            onClick={() => setLogOption("register")}
            className="w-60 h-10 z-20 p-2 my-2 rounded-3xl bg-primary text-sm text-center text-primary-foreground flex justify-center items-center hover:font-bold hover:scale-[105%] transition-all"
          >
            Register a new account
          </div>
        </nav>
      </div>
    );
  }
};

export default PreScreenMenu;
