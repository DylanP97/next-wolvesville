"use client";

import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { defaultAvatar } from "../lib/utils";
import { useTranslation } from "react-i18next";
import ConnexionForm from "./ConnexionForm";
import { Spinner, Button } from "@nextui-org/react";
import io from "socket.io-client"; // Add this import
import { fetchLogin, fetchSignUp } from "../lib/fetch";
import { getBtnClassNames } from "../lib/styles";
import PreServerLoadingScreen from "./PreServerLoadingScreen";
import { useEffect } from "react";

const Connexion = ({ logOption, onBack }) => {
  const { t } = useTranslation();
  const { setAuthInfo, setSocket, setToken, setIsDev } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(logOption === "login");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(50); // Timer state


  const handleSwitch = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      const login = async () => {
        const data = await fetchLogin(email, password);

        if (data) {
          setToken(data.token);
          setIsDev(data.isDev || false);
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
              isGuest: false,
            };
            newSocket.emit("sendNewConnectedUser", user);
          });
        }
      };
      login();
      setIsLoading(false);
    } else {
      const resOk = fetchSignUp(username, email, password, defaultAvatar);
      if (resOk) setIsLogin(true);
      setIsLoading(false);
      setCountdown(50); // Reset the countdown when loading is finished
    }
  };

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

  return (
    <div className="flex flex-col flex-grow justify-center items-center">

      {/* <Title /> */}

      <ConnexionForm
        handleSubmit={handleSubmit}
        isLogin={isLogin}
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />

      <span
        onClick={handleSwitch}
        className="z-20 text-white text-sm hover:underline hover:cursor-pointer hover:text-primary mt-2"
      >
        {isLogin
          ? `${t("intro.nry")} ${t("intro.si")}`
          : `${t("intro.ar")} ${t("intro.lo")}`}
      </span>

      {onBack && (
        <Button
          className={getBtnClassNames("w-60 mt-4") + " font-wolf"}
          color="secondary"
          variant="shadow"
          onClick={onBack}
        >
          {t("goback")}
        </Button>
      )}

      {isLoading && (
        <PreServerLoadingScreen
          countdown={countdown}
        />
      )}
    </div>
  );
};

export default Connexion;
