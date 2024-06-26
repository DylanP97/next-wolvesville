"use client";

import { useTranslation } from "react-i18next";
import AvatarUI from "../profile/components/AvatarUI";

const ConnectedUserCard = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`${
        user.isInRoom ? "bg-green-500" : "bg-red-500"
      } flex flex-row p-4 m-2 h-fit rounded-3xl hover:opacity-90 cursor-pointer`}
    >
      <div className="flex justify-center items-center p-1">
        <AvatarUI heightAndWidth={50} avatar={user.avatar} />
      </div>
      <div>
        <div>
          <p className="text-md">{user.username}</p>
          <p className="text-xs text-gray-200">id: {user.socketId}</p>
        </div>
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
