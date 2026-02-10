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
import { Button, Input, Spinner } from "@nextui-org/react";
import io from "socket.io-client"; // Add this import
import { btnClassNames, getBtnClassNames } from "./lib/styles";
import WerewolfBackground from "./WerewolfBackground";
import GeneralBtns from "./general-btns/GeneralBtns";
import { useToRender } from "./providers/RenderProvider";

const PreScreenMenu = () => {
  const { t } = useTranslation();
  const [logOption, setLogOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(50); // Timer state
  const [isFullscreen, setIsFullscreen] = useState(false); // Add this state
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestUsername, setGuestUsername] = useState("");
  const [guestError, setGuestError] = useState("");
  const { setAuthInfo, setSocket, setToken, username, setIsGuest } = useAuth();
  const { setActiveComponent, activeComponent } = useToRender();

  const validateGuestUsername = (name) => {
    if (name.length < 4) {
      return t("prescreen.guestError.tooShort");
    }
    if (name.length > 18) {
      return t("prescreen.guestError.tooLong");
    }
    return "";
  };

  const handleGuestFormSubmit = () => {
    const error = validateGuestUsername(guestUsername);
    if (error) {
      setGuestError(error);
      return;
    }
    setGuestError("");
    setShowGuestForm(false);
    setIsLoading(true);
    setLogOption("guestPlay");
  };

  const handleGuestLogin = async () => {
    const data = await fetchGuestLogin(guestUsername);

    if (data) {
      if (data.error) {
        setGuestError(data.error);
        setIsLoading(false);
        setShowGuestForm(true);
        setLogOption("");
        return;
      }
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
      handleGuestLogin();
    }
  }, [logOption]);

  // Timer countdown logic
  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

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
  } else if (showGuestForm) {
    return (
      <div className="relative flex flex-col flex-grow justify-center items-center">
        <WerewolfBackground />
        <Title />
        <div className="flex flex-col items-center py-4 w-full z-20 gap-4 px-4">
          <h2 className="text-white text-xl font-bold">{t("prescreen.chooseUsername")}</h2>
          <p className="text-white/70 text-sm text-center max-w-xs">{t("prescreen.usernameInfo")}</p>
          <Input
            type="text"
            placeholder={t("prescreen.usernamePlaceholder")}
            value={guestUsername}
            onChange={(e) => {
              setGuestUsername(e.target.value);
              setGuestError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGuestFormSubmit();
              }
            }}
            maxLength={18}
            className="w-72 sm:w-80"
            classNames={{
              input: "text-white",
              inputWrapper: "bg-slate-800/80 border-slate-600",
            }}
            isInvalid={!!guestError}
            errorMessage={guestError}
          />
          <div className="flex gap-3">
            <Button
              className="w-32"
              color="default"
              variant="flat"
              onClick={() => {
                setShowGuestForm(false);
                setGuestUsername("");
                setGuestError("");
              }}
            >
              {t("goback")}
            </Button>
            <Button
              className="w-32"
              color="warning"
              variant="shadow"
              onClick={handleGuestFormSubmit}
            >
              {t("prescreen.play")}
            </Button>
          </div>
        </div>
      </div>
    );
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
            onClick={() => setShowGuestForm(true)}
          >
            {t("prescreen.guest")}
          </Button>
          <div className="flex flex-row gap-3">
            <Button
              className="w-36 sm:w-[9.5rem] h-11 text-sm font-medium bg-white/10 text-white hover:bg-white/20"
              variant="flat"
              onClick={() => setLogOption("login")}
            >
              {t("prescreen.logIn")}
            </Button>
            <Button
              className="w-36 sm:w-[9.5rem] h-11 text-sm font-medium bg-white/10 text-white hover:bg-white/20"
              variant="flat"
              onClick={() => setLogOption("register")}
            >
              {t("prescreen.register")}
            </Button>
          </div>
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
