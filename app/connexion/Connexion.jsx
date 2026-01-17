"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import { defaultAvatar } from "../lib/utils";
import { useTranslation } from "react-i18next";
import ConnexionForm from "./ConnexionForm";
import { Spinner, Button, Divider } from "@nextui-org/react";
import io from "socket.io-client";
import { fetchLogin, fetchSignUp } from "../lib/fetch";
import { getBtnClassNames } from "../lib/styles";
import PreServerLoadingScreen from "./PreServerLoadingScreen";
import WerewolfBackground from "../WerewolfBackground";

const Connexion = ({ logOption, onBack }) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { setAuthInfo, setSocket, setToken, setIsDev } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(logOption === "login");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(50);
  const [error, setError] = useState("");

  // Handle Google OAuth callback
  useEffect(() => {
    const token = searchParams.get("token");
    const oauthUsername = searchParams.get("username");
    const userId = searchParams.get("userId");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError(t("intro.oauthError") || "Google login failed. Please try again.");
      return;
    }

    if (token && oauthUsername) {
      // Successfully logged in via Google
      setIsLoading(true);
      setToken(token);

      const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
        query: { token },
      });
      setSocket(newSocket);
      setAuthInfo(oauthUsername, defaultAvatar, true, newSocket.id);

      newSocket.on("connect", () => {
        const user = {
          username: oauthUsername,
          avatar: defaultAvatar,
          socketId: newSocket.id,
          token: token,
          isGuest: false,
        };
        newSocket.emit("sendNewConnectedUser", user);
        setIsLoading(false);
      });
    }
  }, [searchParams]);


  const handleSwitch = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    if (isLogin) {
      try {
        const data = await fetchLogin(email, password);

        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return;
        }

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
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        console.error("Login error:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const result = await fetchSignUp(username, email, password, defaultAvatar);

        if (result.error) {
          setError(result.error);
          setIsLoading(false);
          return;
        }

        if (result.success) {
          setIsLogin(true);
          setError(""); // Clear any errors
          // Optionally show success message
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        console.error("Signup error:", err);
      } finally {
        setIsLoading(false);
        setCountdown(50);
      }
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
    }

    return () => clearInterval(timer);
  }, [isLoading, countdown]);

  // Handle Google OAuth login
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/user/auth/google`;
  };

  return (
    <div className="flex flex-col flex-grow justify-center items-center">

      <h1 className="text-white text-center text-4xl mb-2 font-wolf z-20">
        {isLogin ? t("intro.lo") : t("intro.si")}
      </h1>

      {error && (
        <div className="w-60 mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-200 text-sm text-center">{error}</p>
        </div>
      )}

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

      {/* Google OAuth divider and button */}
      <div className="w-80 flex items-center gap-3 my-4">
        <Divider className="flex-1" />
        <span className="text-gray-400 text-sm">{t("intro.or") || "or"}</span>
        <Divider className="flex-1" />
      </div>

      <Button
        className="w-80 h-12 bg-white hover:bg-gray-100 text-gray-700 font-medium"
        variant="flat"
        onClick={handleGoogleLogin}
        startContent={
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        }
      >
        {t("intro.googleLogin") || "Continue with Google"}
      </Button>

      <Button
        className={getBtnClassNames("w-80 mt-4") + " font-wolf"}
        color="secondary"
        variant="shadow"
        onClick={handleSwitch}
      >
        {isLogin
          ? `${t("intro.nry")} ${t("intro.si")}`
          : `${t("intro.ar")} ${t("intro.lo")}`}
      </Button>

      {onBack && (
        <Button
          className={getBtnClassNames("w-80") + " font-wolf"}
          color="secondary"
          variant="shadow"
          onClick={onBack}
        >
          {t("goback")}
        </Button>
      )}

      {isLoading && <PreServerLoadingScreen countdown={countdown} />}
      <WerewolfBackground />
    </div>
  );
};

export default Connexion;
