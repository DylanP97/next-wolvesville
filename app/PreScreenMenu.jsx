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

const PreScreenMenu = () => {
  const { t } = useTranslation();
  const [logOption, setLogOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(50); // Timer state
  const [isFullscreen, setIsFullscreen] = useState(false); // Add this state
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
        <nav className="top-1/3 flex flex-col items-center py-4 w-full z-20">
          <Button
            className={getBtnClassNames("w-80") + " text-md font-medium h-12 font-wolf"}
            color="primary"
            variant="shadow"
            onClick={() => setLogOption("guestPlay")}
          >
            {t("prescreen.guest")}
          </Button>
          <Button
            className={getBtnClassNames("w-80") + " text-md font-medium h-12 font-wolf"}
            color="primary"
            onClick={() => setLogOption("login")}
            variant="shadow"
          >
            {t("prescreen.logIn")}
          </Button>
          <Button
            className={getBtnClassNames("w-80") + " text-md font-medium h-12 font-wolf"}
            color="primary"
            onClick={() => setLogOption("register")}
            variant="shadow"
          >
            {t("prescreen.register")}
          </Button>
        </nav>

        <a
          target="_blank"
          rel="noopener noreferrer"
          className="italic text-white flex justify-center text-xs
                   hover:underline hover:text-primary transition-colors z-20"
          href="https://www.wolvesville.com"
        >
          {t("intro.ref")}
        </a>
        <p className="italic pt-4 px-8 text-center text-white text-xs max-w-[500px] z-20">{t("intro.additionalInfo")}</p>
        {
          !isFullscreen && (<p className="absolute top-16 right-6 italic text-center text-white text-xs z-20 animate-pulse">{t("intro.betterExperience")}</p>)
        }
      </div>
    );
  }
};

export default PreScreenMenu;
