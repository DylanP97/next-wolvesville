"use client";

import { Button } from "@nextui-org/react";
import { useAuth } from "../providers/AuthProvider";
import AvatarUI from "../profile/Profile/AvatarUI";
import { useTranslation } from "react-i18next";

const ConnectedUsers = () => {
  const { t } = useTranslation();
  const { connectedUsers } = useAuth();

  return (
    <div className="h-screen h-full w-full bg-black p-4">
      <h1 className="text-white text-3xl font-bold mb-6 mt-10">
        {t("connected.title")}
      </h1>
      {!connectedUsers ? (
        <div className="m-4">
          <p className="text-white">{t("connected.nousers")}</p>
        </div>
      ) : (
        connectedUsers.map((user, index) => {
          return (
            <div
              key={"usercard" + index}
              className="flex flex-row bg-white p-4 m-2 rounded-3xl hover:opacity-90 cursor-pointer"
            >
              <div className="flex justify-center items-center p-1">
                <AvatarUI heightAndWidth={50} avatar={user.avatar} />
              </div>
              <div>
                <p className="text-md text-gray-800">{user.username}</p>
                <p className="text-xs text-gray-800">id: {user.socketId}</p>
                {user.isInRoom ? (
                  <p className="text-xs text-gray-800">
                    🟢 {t("home.status.1")} {user.isInRoom}
                  </p>
                ) : (
                  <p className="text-xs text-gray-800">
                    🔴 {t("home.status.2")}
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
      <br />
      <Button
        className="mt-6"
        color="secondary"
        variant="ghost"
        onClick={() => window.history.back()}
      >
        {t("goback")}
      </Button>
    </div>
  );
};

export default ConnectedUsers;
