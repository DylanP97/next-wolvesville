"use client";

import { useAuth } from "./providers/AuthProvider";
import { useTranslation } from "react-i18next";
import ConnectedUserCard from "./ConnectedUserCard";
import { useEffect, useState } from "react";
import { fetchUsers } from "./lib/fetch";
import AvatarUI from "./components/AvatarUI";

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
    <div className="relative pt-[70px] flex flex-grow flex-col justify-between w-full p-4">
      <h1 className="text-white text-3xl font-bold my-6 font-wolf">
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
      {/* <h2 className="text-white text-3xl font-bold my-6">Not Connected</h2>
      <div className="flex justify-start flex-wrap w-full mb-8">
        {nonConnectedUsers &&
          nonConnectedUsers.map((user) => {
            return (
              <AvatarUI
                heightAndWidth={50}
                avatar={user.avatar}
                key={"notconnected" + user.username}
              />
            );
          })}
      </div> */}
    </div>
  );
};

export default ConnectedUsers;
