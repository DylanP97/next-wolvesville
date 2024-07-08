"use client";

import { useAuth } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import ConnectedUserCard from "./ConnectedUserCard";
import GoBackBtn from "../components/GoBackBtn";
import { useEffect, useState } from "react";
import { fetchUsers } from "../lib/fetch";

const ConnectedUsers = () => {
  const { t } = useTranslation();
  const { connectedUsers } = useAuth();
  const [nonConnectedUsers, setNonConnectedUsers] = useState([]);

  const defineNonConnectedUsers = async () => {
    const allUsers = await fetchUsers();
    console.log("allUsers");
    console.log(allUsers);
    if (allUsers) {
      const membersNotHere = allUsers.data.filter((user) => {
        return !connectedUsers.includes(user.id);
      });
      setNonConnectedUsers(membersNotHere);
    }
  };

  useEffect(() => {
    defineNonConnectedUsers();
  }, []);

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
        </div>
      )}
      <div className="my-2">
        <h2 className="text-white text-xl font-bold my-4">
          Not Connected
        </h2>
        {nonConnectedUsers &&
          nonConnectedUsers.map((user, index) => {
            return (
              <div className="my-2" key={"notconnected" + index}>
                <p className="text-white text-xs">{user.username}</p>
                <p className="text-white text-xs">{user.email}</p>
              </div>
            );
          })}
      </div>
      <GoBackBtn />
    </div>
  );
};

export default ConnectedUsers;
