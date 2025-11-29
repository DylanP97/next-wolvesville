"use client";

import { useState } from "react";
import { useAuth } from "./providers/AuthProvider";
import { useTranslation } from "react-i18next";
import { Button, Tab, Tabs, Select, SelectItem, Card, CardBody } from "@nextui-org/react";
import { Check, Sparkles } from "lucide-react";
import { tabs } from "./lib/tabsDefinitions";
import AvatarUI from "./components/AvatarUI";

const ProfileSelect = ({ path, label, options, currentValue, setAvState }) => {
  const updateState = (keys) => {
    const option = keys.values().next().value;
    setAvState((prevAvatar) => ({
      ...prevAvatar,
      [path]: option,
    }));
  };

  return (
    <Select
      label={label}
      selectedKeys={new Set([currentValue])}
      onSelectionChange={updateState}
      variant="bordered"
      className="w-full text-white/70"
      classNames={{
        trigger: "bg-white/10 border-white/20 hover:bg-white/20 data-[hover=true]:bg-white/20",
        value: "text-white",
        label: "!text-white"
      }}
    >
      {options.map((option) => (
        <SelectItem key={option} value={option} className="text-black">
          {option}
        </SelectItem>
      ))}
    </Select>
  );
};

const Profile = () => {
  const [response, setResponse] = useState("");
  const { setAuthInfo, username, avatar, socketId, isConnected } = useAuth();
  const [avState, setAvState] = useState(avatar);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    setIsSaving(true);
    setShowSuccess(false);

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

      const userData = await response.json();
      setResponse(userData.message);

      if (response.ok) {
        setAuthInfo(userData.username, userData.avatar, isConnected, socketId);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      setResponse("An error occurred while updating profile");
      console.error("Login error:", error);
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">{t("customizeAvatar") || "Customize Your Avatar"}</h1>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-white/60">{t("createCharacter") || "Create your unique character"}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left side - Avatar Preview */}
          <div className="flex flex-col items-center gap-6">
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 w-full">
              <CardBody className="flex flex-col items-center p-8 gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
                  <div className="relative bg-white rounded-full p-2 shadow-2xl border-4 border-white/20">
                    <AvatarUI avatar={avState} heightAndWidth={160} />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-1">{username}</h3>
                  <p className="text-sm text-white/60">{t("avatarPreview") || "Your avatar will look like this"}</p>
                </div>
              </CardBody>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSubmit}
              isLoading={isSaving}
              size="lg"
              className={`w-full font-semibold transition-all ${showSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                }`}
              startContent={showSuccess ? <Check className="w-5 h-5" /> : null}
            >
              {showSuccess ? t("saved") || "Saved!" : isSaving ? t("saving") || "Saving..." : t("submit") || "Save Changes"}
            </Button>

            {response && (
              <div className={`w-full text-center p-3 rounded-lg ${showSuccess ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                }`}>
                {response}
              </div>
            )}
          </div>

          {/* Right side - Customization Options */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10">
            <CardBody className="p-6">
              <Tabs
                aria-label="Avatar customization tabs"
                variant="underlined"
                color="primary"
                classNames={{
                  tabList: "gap-6 w-full relative rounded-none p-0 border-b border-white/10",
                  cursor: "w-full bg-gradient-to-r from-blue-500 to-purple-500",
                  tab: "max-w-fit px-4 h-12",
                  tabContent: "group-data-[selected=true]:text-white text-white/60"
                }}
                disableAnimation
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.title}
                    title={
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{tab.emoji}</span>
                        <span className="font-medium">{tab.title}</span>
                      </div>
                    }
                  >
                    <div className="flex flex-col gap-4 py-6 min-h-[400px]">
                      {tab.attributes.map((attr, i) => (
                        <ProfileSelect
                          key={`${attr.label}-${i}`}
                          path={attr.path}
                          label={attr.label}
                          options={attr.options}
                          currentValue={avState[attr.path]}
                          setAvState={setAvState}
                        />
                      ))}
                    </div>
                  </Tab>
                ))}
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;