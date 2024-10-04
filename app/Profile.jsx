"use client";

import { useState } from "react";
import { useAuth } from "./providers/AuthProvider";
import { useTranslation } from "react-i18next";
import { Button, Tab, Tabs } from "@nextui-org/react";
import { tabs } from "./lib/tabsDefinitions";
import ProfileSelect from "./ProfileSelect";
import GoBackBtn from "./components/GoBackBtn";
import AvatarUI from "./components/AvatarUI";

const Profile = () => {
  const [response, setResponse] = useState("");
  const { setAuthInfo, username, avatar, socketId } = useAuth();
  const [avState, setAvState] = useState(avatar);
  const { t } = useTranslation();

  const handleSubmit = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${apiUrl}/api/user/editProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          avatar: avState,
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        setResponse(userData.message);
        setAuthInfo(userData.username, userData.avatar);
      }
    } catch (error) {
      setResponse(userData.message);
      console.error("Login error:", error);
    }
  };

  console.log("avState", avState);

  return (
    <section className="h-screen w-full px-5 flex flex-col justify-center items-center ">
      <div
        className={`bg-white rounded-full flex justify-center my-4 overflow-hidden`}
      >
        <AvatarUI avatar={avState} heightAndWidth={140} />
      </div>

      <div className="flex w-full flex-col w-full max-w-[500px]">
        <Tabs
          aria-label="Options"
          variant="solid"
          color="primary"
          className="justify-center"
          placement="top"
        >
          {tabs.map((tab) => {
            return (
              <Tab
                key={tab.title}
                title={tab.title + " " + tab.emoji}
                className="w-full"
              >
                {tab.attributes.map((a, i) => {
                  return (
                    <ProfileSelect
                      key={a.label + i + "-ps"}
                      path={a.path}
                      label={a.label}
                      options={a.options}
                      currentValue={avState[a.path]}
                      setAvState={setAvState}
                    />
                  );
                })}
              </Tab>
            );
          })}
        </Tabs>
      </div>

      <div className="flex gap-2 my-4">
        <GoBackBtn />
        <Button
          className="text-black hover:text-primary"
          color="primary"
          variant="faded"
          onClick={handleSubmit}
        >
          {t("submit")}
        </Button>
      </div>
      <p className="text-white text-sm mt-4">{response}</p>
    </section>
  );
};

export default Profile;
