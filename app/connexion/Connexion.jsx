"use client";

import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { defaultAvatar } from "../lib/utils";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import evilEyes from "../../public/game/evileyes.gif";
import ConnexionForm from "./ConnexionForm";
import { Spinner } from "@nextui-org/react";
import io from "socket.io-client"; // Add this import

const Connexion = () => {
  const { t } = useTranslation();
  const { setAuthInfo, setSocket, setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSwitch = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLogin) {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/user/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
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
            };
            newSocket.emit("sendNewConnectedUser", user);
          });
        }
      } catch (error) {
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/user/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password, defaultAvatar }),
            credentials: "include",
          }
        );

        console.log("Signup response:", response);
        if (response.ok) {
          setIsLogin(true);
        }
      } catch (error) {
        console.error("Signup error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col flex-grow justify-center items-center bg-black">
      <Image
        priority
        className="absolute top-8"
        alt=""
        src={evilEyes}
        height={700}
        width={700}
        style={{ width: "auto", height: "auto" }}
      />
      <div className="m-4 z-10">
        <h1 className="opacity-80 text-white text-center text-3xl font-bold mb-2">
          {t("intro.title")}
        </h1>
        <a
          target="_blank"
          className="text-white flex justify-center hover:underline pointer text-sm hover:text-primary"
          href="https://www.wolvesville.com"
        >
          {t("intro.ref")}
        </a>
      </div>

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
