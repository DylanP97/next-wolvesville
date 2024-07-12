"use client";

import { useAuth } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import ConnectedUserCard from "./ConnectedUserCard";
import GoBackBtn from "../components/GoBackBtn";
import { useEffect, useState } from "react";
import { fetchUsers } from "../lib/fetch";
import AvatarUI from "../components/AvatarUI";

const ConnectedUsers = () => {
  const { t } = useTranslation();
  const { connectedUsers } = useAuth();
  const [nonConnectedUsers, setNonConnectedUsers] = useState([]);

  const defineNonConnectedUsers = async () => {
    const allUsers = await fetchUsers();
    if (allUsers) {
      const membersNotHere = allUsers.data.filter(
        (user) =>
          !connectedUsers.some(
            (connectedUser) => connectedUser.username === user.username
          )
      );
      setNonConnectedUsers(membersNotHere);
    }
  };

  useEffect(() => {
    defineNonConnectedUsers();
  }, []);

  return (
    <div className="bg-background flex flex-col flex-grow justify-between w-full p-4">
      <h1 className="text-white text-3xl font-bold my-6">
        {t("connected.title")}
      </h1>
      {!connectedUsers ? (
        <div className="m-4">
          <p className="text-white">{t("connected.nousers")}</p>
        </div>
      ) : (
        <div className="flex flex-grow flex-col">
          {connectedUsers.map((user, index) => {
            return <ConnectedUserCard key={"usercard" + index} user={user} />;
          })}
        </div>
      )}
      <div className="my-4">
        <h2 className="text-white text-xl font-bold my-2">Not Connected</h2>
        <div className="flex justify-center flex-wrap w-full">
          {nonConnectedUsers &&
            nonConnectedUsers.map((user) => {
              return (
                <AvatarUI
                  heightAndWidth={50}
                  avatar={user.avatar}
                  key={"notconnected" + user.name}
                />
              );
            })}
        </div>
      </div>
      <GoBackBtn />
    </div>
  );
};

export default ConnectedUsers;
