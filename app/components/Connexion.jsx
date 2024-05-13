"use client";

import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useAuth } from "../providers/AuthProvider";
import { defaultAvatar } from "../lib/utils";
import { useTranslation } from "react-i18next";

const Connexion = () => {
  const { t } = useTranslation();
  const { setAuthInfo } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitch = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    <div className="absolute top-0 left-0 bg-black h-screen w-screen flex flex-col justify-center items-center">
      <div className="m-4">
        <h1 className="text-white text-center text-3xl text-bold mb-2">
          {t("intro.title")}
        </h1>
        <a
          target="_blank"
          className="text-white flex justify-center italic hover:underline pointer text-sm hover:text-primary"
          href="https://www.wolvesville.com"
        >
          {t("intro.ref")}
        </a>
      </div>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="w-[95%] m-2">
            <Input
              color="secondary"
              isRequired
              type="text"
              label={t("intro.un")}
              value={username}
              className="max-w-xs bg-white rounded-2xl"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
        <div className="w-[95%] m-2">
          <Input
            color="secondary"
            isRequired
            type="email"
            label={t("intro.em")}
            value={email}
            className="max-w-xs bg-white rounded-2xl"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-[95%] m-2">
          <Input
            color="secondary"
            isRequired
            type="password"
            label={t("intro.pw")}
            value={password}
            autocomplete="current-password"
            className="max-w-xs bg-white rounded-2xl"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <Button
            variant="shadow"
            color="primary"
            className="w-[95%] mx-2 mb-2 hover:text-white"
            type="submit"
          >
            {isLogin ? t("intro.lo") : t("intro.si")}
          </Button>
        </div>
      </form>

      <p className="text-white">
        {isLogin ? t("intro.nry") : t("intro.ar")}
        <span
          onClick={handleSwitch}
          className="hover:underline pointer text-primary"
        >
          {isLogin ? t("intro.si") : t("intro.lo")}
        </span>
      </p>
    </div>
  );
};

export default Connexion;
