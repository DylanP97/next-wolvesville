"use client";

import { useAuth } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import ConnectedUserCard from "./ConnectedUserCard";
import GoBackBtn from "../components/GoBackBtn";
import { useEffect, useState } from "react";

const ConnectedUsers = () => {
  const { t } = useTranslation();
  const { connectedUsers } = useAuth();

  const [notConnectedUsers, setNotConnectedUsers] = useState([]);


  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (connectedUsers.length === 0) {
      setTimeout(() => {
        setConnectedUsers(users);
      }, 1000);
    }
  }, [connectedUsers]);

  return (
    <div className="bg-background flex flex-col flex-grow justify-between w-full p-4">
      <h1 className="text-white text-3xl font-bold mb-6 mt-10">
        {t("connected.title")}
      </h1>
      {!connectedUsers ? (
        <div className="m-4">
          <p className="text-white">{t("connected.nousers")}</p>
        </div>
      ) : (
        <div className="flex flex-grow flex-col max-w-[400px]">
          {connectedUsers.map((user, index) => {
            return <ConnectedUserCard key={"usercard" + index} user={user} />;
          })}
          {notConnectedUsers.map((user, index) => {
            return <ConnectedUserCard key={"usercard" + index} user={user} />;
          })}
        </div>
      )}
      <GoBackBtn />
    </div>
  );
};

export default ConnectedUsers;
