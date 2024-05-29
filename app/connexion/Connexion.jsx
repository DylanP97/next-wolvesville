"use client";

import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { defaultAvatar } from "../lib/utils";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import evilEyes from "../../public/game/evileyes.gif";
import ConnexionForm from "./ConnexionForm";
import { Spinner } from "@nextui-org/react";

const Connexion = () => {
  const { t } = useTranslation();
  const { setAuthInfo } = useAuth();
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
          }
        );
        if (response.ok) {
          const userData = await response.json();
          setAuthInfo(userData.username, userData.avatar, true);
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
          }
        );

        console.log("Signup response:", response);
        if (response.ok) {
          setIsLogin(true);
        }
      } catch (error) {
        console.error("Signup error:", error);
      }
    }
  };

  return (
    <div className="flex flex-col flex-grow justify-center items-center bg-black">
      <Image
        className="absolute top-8"
        alt=""
        src={evilEyes}
        height={300}
        width={300}
      />
      <div className="m-4 z-10">
        <h1 className="text-white text-center text-3xl font-bold mb-2">
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

      {isLoading && (
        <div className="text-white flex justify-center items-center">
          <Spinner />
          <p>{t("intro.loading")}</p>
        </div>
      )}

      <span
        onClick={handleSwitch}
        className="hover:underline pointer text-white hover:text-primary"
      >
        {isLogin
          ? `${t("intro.nry")} ${t("intro.si")}`
          : `${t("intro.ar")} ${t("intro.lo")}`}
      </span>
    </div>
  );
};

export default Connexion;
