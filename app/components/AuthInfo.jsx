"use client";

import AvatarUI from "../profile/Profile/AvatarUI";
import { useTranslation } from "react-i18next";

const AuthInfo = ({ username, socketId, isInRoom, avatar }) => {
  const { t } = useTranslation();

  const welcomeMsgs = [
    `👋 ${t("home.1")} ${username}${t("questionmark")}`,
    `😀 ${t("home.2")} ${username}${t("exclamation")}`,
    `🐺 ${t("home.3")} ${username}${t("questionmark")}`,
  ];

  const randomIndex = Math.floor(Math.random() * welcomeMsgs.length);

  return (
    <header className="p-4 flex justify-center items-center">
      <div className="mx-2 flex items-center justify-center bg-primary rounded-full overflow-hidden">
        <AvatarUI avatar={avatar} heightAndWidth={80} />
      </div>
      <div className="h-full">
        <p className="text-md text-white">{welcomeMsgs[randomIndex]}</p>
        {isInRoom ? (
          <p className="text-md text-white">
            🟢 {t("home.status.1")} {isInRoom}
          </p>
        ) : (
          <p className="text-md text-white">🔴 {t("home.status.2")}</p>
        )}
      </div>
    </header>
  );
};

export default AuthInfo;
