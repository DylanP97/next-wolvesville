"use client";

import { useTranslation } from "react-i18next";
import HomePage from "./homepage/HomePage";
import Connexion from "./connexion/Connexion";
import PreServerLoadingScreen from "./connexion/PreServerLoadingScreen";
import Title from "./Title";
import { useEffect, useState } from "react";
import { defaultAvatar } from "./lib/utils";
import { useAuth } from "./providers/AuthProvider";
import { fetchGuestLogin } from "./lib/fetch";
import { Button, Spinner } from "@nextui-org/react";
import io from "socket.io-client"; // Add this import
import { btnClassNames, getBtnClassNames } from "./lib/styles";
import WerewolfBackground from "./WerewolfBackground";
import GeneralBtns from "./general-btns/GeneralBtns";
import { useToRender } from "./providers/RenderProvider";
import RolesGrid from "./RolesGrid";

const PreScreenMenu = () => {
  const { t } = useTranslation();
  const [logOption, setLogOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(50); // Timer state
  const [isFullscreen, setIsFullscreen] = useState(false); // Add this state
  const { setAuthInfo, setSocket, setToken, username, setIsGuest } = useAuth();
  const { setActiveComponent, activeComponent } = useToRender();

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
    setCountdown(50); // Reset the countdown when loading is finished
  };

  // Add this useEffect to track fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    // Set initial state
    setIsFullscreen(document.fullscreenElement !== null);

    // Listen for fullscreen changes
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (logOption === "guestPlay") {
      setIsLoading(true);
      handleGuestLogin();
    }
  }, [logOption]);

  // Timer countdown logic
  useEffect(() => {
    let timer;
    if (isLoading && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    if (countdown === 0) {
      clearInterval(timer);
      // Handle what happens when countdown reaches zero, if needed
    }

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, [isLoading, countdown]);

  if (isLoading) {
    return (
      <>
        <PreServerLoadingScreen
          countdown={countdown}
        />
      </>
    );
  }

  if (logOption === "guestPlay" && isLoading === false) {
    return (
      <HomePage username={username} isInRoom={false} avatar={defaultAvatar} />
    );
  } else if (logOption === "login" || logOption === "register") {
    return <Connexion logOption={logOption} onBack={() => setLogOption("")} />;
  } else {
    return (
      <div className="relative flex flex-col flex-grow justify-center items-center">
        <WerewolfBackground />
        <Title />
        <nav className="flex flex-col items-center py-4 w-full z-20 gap-3">
          <Button
            className="w-72 sm:w-80 h-14 text-lg font-bold shadow-lg shadow-amber-500/30 border-2 border-yellow-300/60"
            color="warning"
            variant="shadow"
            onClick={() => setLogOption("guestPlay")}
          >
            {t("prescreen.guest")}
          </Button>
          <div className="flex flex-row gap-3">
            <Button
              className="w-36 sm:w-[9.5rem] h-11 text-sm font-medium"
              color="primary"
              variant="flat"
              onClick={() => setLogOption("login")}
            >
              {t("prescreen.logIn")}
            </Button>
            <Button
              className="w-36 sm:w-[9.5rem] h-11 text-sm font-medium"
              color="primary"
              variant="flat"
              onClick={() => setLogOption("register")}
            >
              {t("prescreen.register")}
            </Button>
          </div>
          <button
            className="text-sm text-slate-300 hover:text-white underline underline-offset-4 transition-colors"
            onClick={() => setActiveComponent(<RolesGrid onBack={() => {setActiveComponent(<PreScreenMenu />)}} />)}
          >
            {t("menu.4")}
          </button>
        </nav>

        <p className="italic px-8 text-center text-white/70 text-sm max-w-[500px] z-20">{t("intro.additionalInfo")}</p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="italic pt-2 text-white/50 flex justify-center text-xs
                   hover:underline hover:text-primary transition-colors z-20"
          href="https://www.wolvesville.com"
        >
          {t("intro.ref")}
        </a>
        {
          !isFullscreen && (<p className="absolute top-16 right-6 italic text-center text-white text-xs z-20 animate-pulse">{t("intro.betterExperience")}</p>)
        }
      </div>
    );
  }
};

export default PreScreenMenu;
