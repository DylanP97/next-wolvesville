"use client";

import { useTranslation } from "react-i18next";
import AvatarUI from "../components/AvatarUI";
import IsInRoomInfo from "../components/IsInRoomInfo";

const AuthInfo = ({ username, isInRoom, avatar }) => {
  const { t } = useTranslation();

  const welcomeMsgs = [
    `👋 ${t("home.1")} ${username}${t("questionmark")}`,
    `😀 ${t("home.2")} ${username}${t("exclamation")}`,
    `🐺 ${t("home.3")} ${username}${t("questionmark")}`,
  ];

  const randomIndex = Math.floor(Math.random() * welcomeMsgs.length);

  return (
    <header className="mt-6 p-4 flex justify-center items-center">
      <AvatarUI avatar={avatar} heightAndWidth={80} />
      <div className="h-full">
        <p className="text-md text-white">{welcomeMsgs[randomIndex]}</p>
        <IsInRoomInfo isInRoom={isInRoom} />
      </div>
    </header>
  );
};

export default AuthInfo;
