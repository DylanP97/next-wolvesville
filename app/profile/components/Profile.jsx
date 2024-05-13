"use client";

import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import { Tabs, Tab } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { headTab, clothesTab, bodyTab, eyesTab } from "./tabs";
import ProfileSelect from "./ProfileSelect";
import AvatarUI from "./AvatarUI";
import GoBackBtn from "../../components/GoBackBtn";

const Profile = ({ username, avatar, socketId }) => {
  const [avState, setAvState] = useState(avatar);
  const [response, setResponse] = useState("");
  const { setAuthInfo } = useAuth();
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
        setAuthInfo(userData.username, userData.avatar, true, socketId);
      }
    } catch (error) {
      setResponse(userData.message);
      console.error("Login error:", error);
    }
  };

  return (
    <section className="bg-black w-full p-5 flex flex-col justify-start items-center">
      <div className="flex flex-col gap-3 m-4">
        <h1 className="font-bold text-xl text-white">
          Edit Your Profile {username || "Guest"}
        </h1>
        <div className={`bg-white rounded-3xl flex justify-center`}>
          <AvatarUI avatar={avState} heightAndWidth={140} />
        </div>
      </div>

      <div className="flex w-full flex-col max-w-[400px]">
        <Tabs aria-label="Options" className="justify-center">
          <Tab title={headTab.title + " " + headTab.emoji}>
            {headTab.attributes.map((a, i) => {
              return (
                <ProfileSelect
                  key={a.label + i + "-ps"}
                  label={a.label}
                  options={a.options}
                  currentValue={avState[a.label]}
                  setAvState={setAvState}
                />
              );
            })}
          </Tab>
          <Tab title={clothesTab.title + " " + clothesTab.emoji}>
            {clothesTab.attributes.map((a, i) => {
              return (
                <ProfileSelect
                  key={a.label + i + "-ps"}
                  label={a.label}
                  options={a.options}
                  currentValue={avState[a.label]}
                  setAvState={setAvState}
                />
              );
            })}
          </Tab>
          <Tab title={bodyTab.title + " " + bodyTab.emoji}>
            {bodyTab.attributes.map((a, i) => {
              return (
                <ProfileSelect
                  key={a.label + i + "-ps"}
                  label={a.label}
                  options={a.options}
                  currentValue={avState[a.label]}
                  setAvState={setAvState}
                />
              );
            })}
          </Tab>
          <Tab title={eyesTab.title + " " + eyesTab.emoji}>
            {eyesTab.attributes.map((a, i) => {
              return (
                <ProfileSelect
                  key={a.label + i + "-ps"}
                  label={a.label}
                  options={a.options}
                  currentValue={avState[a.label]}
                  setAvState={setAvState}
                />
              );
            })}
          </Tab>
        </Tabs>
      </div>

      <div className="flex gap-2">
        <GoBackBtn />
        <Button
          className="hover:text-white"
          color="primary"
          variant="ghost"
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
