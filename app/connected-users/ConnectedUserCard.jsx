"use client";

import { useTranslation } from "react-i18next";
import AvatarUI from "../profile/components/AvatarUI";

const ConnectedUserCard = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`${
        user.isInRoom ? "bg-green-500" : "bg-red-500"
      } flex flex-row p-2 m-2 h-fit rounded-3xl hover:opacity-90 cursor-pointer max-w-[350px]`}
    >
      <AvatarUI heightAndWidth={50} avatar={user.avatar} />
      <div className="flex flex-col items-start">
        <p className="text-md">{user.username}</p>
        {user.isInRoom ? (
          <p className="text-xs">
            🟢🎮 {t("home.status.1")} {user.isInRoom}
          </p>
        ) : (
          <p className="text-xs">🔴 {t("home.status.2")}</p>
        )}
      </div>
    </div>
  );
};

export default ConnectedUserCard;
