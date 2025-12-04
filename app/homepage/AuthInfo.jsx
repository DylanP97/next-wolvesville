"use client";

import { useTranslation } from "react-i18next";
import AvatarUI from "../components/AvatarUI";
import IsInRoomInfo from "../components/IsInRoomInfo";
import { useEffect, useState } from "react";

const AuthInfo = ({ username, isInRoom, isPlaying, avatar }) => {
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const { t } = useTranslation();
  const welcomeMsgs = [
    `👋 ${t("home.1")} ${username}${t("questionmark")}`,
    `😀 ${t("home.2")} ${username}${t("exclamation")}`,
    `🐺 ${t("home.3")} ${username}${t("questionmark")}`,
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * welcomeMsgs.length);
    setWelcomeMsg(welcomeMsgs[randomIndex]);
  }, [])



  return (
    <header className="pt-[70px] m-2 p-4 flex justify-center items-center">
      <div className="m-2">
        <AvatarUI avatar={avatar} heightAndWidth={80} />
      </div>
      <div className="h-full flex flex-col justify-center">
        <p className="text-sm text-white">{welcomeMsg}</p>
        <IsInRoomInfo isInRoom={isInRoom} isPlaying={isPlaying} />
      </div>
    </header>
  );
};

export default AuthInfo;
