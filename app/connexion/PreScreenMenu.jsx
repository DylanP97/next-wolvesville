"use client";

import { useTranslation } from "react-i18next";
import HomePage from "../homepage/HomePage";
import Connexion from "./Connexion";
import Title from "./Title";
import { useState } from "react";
import { defaultAvatar } from "../lib/utils";
import { useAuth } from "../providers/AuthProvider";
import { fetchGuestLogin } from "../lib/fetch";

const PreScreenMenu = () => {
  const { t } = useTranslation();
  const [logOption, setLogOption] = useState("");
  const { setAuthInfo, setSocket, setToken } = useAuth();

  const logAsGuest = () => {
    const fetchGuestLogin = async () => {
      const data = await fetchGuestLogin(email, password);
      if (data) {
        setToken(data.token);
        const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
          query: { token: data.token },
        });
        setSocket(newSocket);
        setAuthInfo("Guest", data.avatar, true, newSocket.id);
        newSocket.on("connect", () => {
          const user = {
            username: data.username,
            avatar: data.avatar,
            socketId: newSocket.id,
            token: data.token,
          };
          newSocket.emit("sendNewConnectedUser", user);
        });
      }
    };
    fetchGuestLogin();
    return (
      <HomePage username={"Guest"} isInRoom={false} avatar={defaultAvatar} />
    );
  };

  if (logOption === "guestPlay") {
    logAsGuest();
  } else if (logOption === "login" || logOption === "register") {
    return <Connexion />;
  } else if (logOption === "") {
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
