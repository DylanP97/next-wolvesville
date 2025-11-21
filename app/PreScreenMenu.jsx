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
import Image from "next/image";
// import background1 from "../public/game/background1.jpeg";
// import background2 from "../public/game/background2.jpeg";
// import background3 from "../public/game/background3.jpeg";
import WerewolfBackground from "./WerewolfBackground";

const PreScreenMenu = () => {
  const { t } = useTranslation();
  const [logOption, setLogOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(50); // Timer state
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
      <div className="z-20 text-center text-white flex flex-col justify-center items-center m-2">
        <Spinner />
        <p>{t("intro.loading")}</p>
        <span className="text-center text-xs text-white">
          {t("intro.loading.info")}
        </span>
        <div className="text-center text-white text-xl mt-4">
          {countdown}
        </div>
      </div>
    );
  }

  if (logOption === "guestPlay" && isLoading === false) {
    return (
      <HomePage username={username} isInRoom={false} avatar={defaultAvatar} />
    );
  } else if (logOption === "login" || logOption === "register") {
    console.log("logOption", logOption);
    return <Connexion logOption={logOption} onBack={() => setLogOption("")} />;
  } else {
    return (
      <div className="relative flex flex-col flex-grow justify-center items-center">
        <WerewolfBackground />
        {/* <Image
          priority
          className="absolute top-0 left-0 object-cover h-full w-full"
          alt=""
          src={background3}
          layout="fill" // Makes the image take up the entire parent
          objectFit="cover" // Ensures the image covers the parent while maintaining aspect ratio
        /> */}
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
        <p className="pt-4 px-8 text-center text-white text-sm">{t("intro.additionalInfo")}</p>
      </div>
    );
  }
};

export default PreScreenMenu;
