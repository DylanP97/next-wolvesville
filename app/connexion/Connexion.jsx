"use client";

import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { defaultAvatar } from "../lib/utils";
import { useTranslation } from "react-i18next";
import ConnexionForm from "./ConnexionForm";
import { Spinner } from "@nextui-org/react";
import io from "socket.io-client"; // Add this import
import { fetchLogin, fetchSignUp } from "../lib/fetch";
import Title from "./Title";

const Connexion = ({ logOption }) => {
  const { t } = useTranslation();
  const { setAuthInfo, setSocket, setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(logOption === "login");
  const [isLoading, setIsLoading] = useState(false);

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
    }
  };

  return (
    <div className="flex flex-col flex-grow justify-center items-center bg-black">
      {/* <Image
        priority
        className="absolute top-8"
        alt=""
        src={evilEyes}
        height={700}
        width={700}
        style={{ width: "auto", height: "auto" }}
      /> */}
      <Title />

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
        className="z-20 text-white text-sm hover:underline hover:cursor-pointer hover:text-primary"
      >
        {isLogin
          ? `${t("intro.nry")} ${t("intro.si")}`
          : `${t("intro.ar")} ${t("intro.lo")}`}
      </span>

      {isLoading && (
        <div className="z-20 text-center text-white flex flex-col justify-center items-center m-2">
          <Spinner />
          <p>{t("intro.loading")}</p>
          <span className="text-center text-xs text-gray-200">
            {t("intro.loading.info")}
          </span>
        </div>
      )}
    </div>
  );
};

export default Connexion;
