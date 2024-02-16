"use client";

import { useState } from "react";
import AvatarUI from "./AvatarUI";
import ProfileSelection from "./ProfileSelection"
import { Tabs, Tab } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { schema } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import { useAuth } from "../../providers/AuthProvider";

const ProfileCard = ({ username, avatar }) => {
  const [accessories, setAccessories] = useState(avatar.accessories);
  const [accessoriesColor, setAccessoriesColor] = useState(avatar.accessoriesColor);
  const [clothesColor, setClothesColor] = useState(avatar.clothesColor);
  const [clothing, setClothing] = useState(avatar.clothing);
  const [clothingGraphic, setClothingGraphic] = useState(avatar.clothingGraphic);
  const [eyebrows, setEyebrows] = useState(avatar.eyebrows);
  const [eyes, setEyes] = useState(avatar.eyes);
  const [facialHair, setFacialHair] = useState(avatar.facialHair);
  const [facialHairColor, setFacialHairColor] = useState(avatar.facialHairColor);
  const [hairColor, setHairColor] = useState(avatar.hairColor);
  const [hatColor, setHatColor] = useState(avatar.hatColor);
  const [mouth, setMouth] = useState(avatar.mouth);
  const [size, setSize] = useState(avatar.size);
  const [skinColor, setSkinColor] = useState(avatar.skinColor);
  const [top, setTop] = useState(avatar.top);

  const { setAuthInfo } = useAuth();

  const options = {
    ...schema.properties,
    ...avataaars.schema.properties,
  };

  const handleSubmit = async () => {
    const apiUrl = "http://localhost:5000";

    try {
      const response = await fetch(`${apiUrl}/api/user/editProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar: {
            accessories, accessoriesColor, clothesColor, clothing, clothingGraphic, eyebrows, eyes, facialHair, facialHairColor, hairColor, hatColor, mouth, size, skinColor, top
          }
        }),
      });
      if (response.ok) {
        const userData = await response.json();
        setAuthInfo(userData.username, userData.avatar, true);
      };
    } catch (error) {
      console.error("Login error:", error);
    };
  };

  return (
    <section className="w-full p-5 flex flex-col justify-center items-center">
      <div className="flex flex-col gap-3 m-4">
        <h1 className="font-bold text-xl text-white">Edit Your Profile {username || "Guest"}</h1>
        <div className={`bg-white rounded-3xl flex justify-center`}>
          <AvatarUI heightAndWidth={140} accessories={accessories} accessoriesColor={accessoriesColor} clothesColor={clothesColor} clothing={clothing} clothingGraphic={clothingGraphic} eyebrows={eyebrows} eyes={eyes} facialHair={facialHair}
            facialHairColor={facialHairColor} hairColor={hairColor} hatColor={hatColor} mouth={mouth} size={size} skinColor={skinColor} top={top} />
        </div>
      </div>
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options">
          <Tab key="accessories" title="👓">
            <ProfileSelection options={options.accessories.default} state={setAccessories} label={"accessories"} />
            <ProfileSelection options={options.accessoriesColor.default} state={setAccessoriesColor} label={"accessories color"} />
            <ProfileSelection options={options.hatColor.default} state={setHatColor} label={"hat color"} />
          </Tab>
          <Tab key="clothes" title="👕">
            <ProfileSelection options={options.clothesColor.default} state={setClothesColor} label={"clothes color"} />
            <ProfileSelection options={options.clothing.default} state={setClothing} label={"clothing"} />
            <ProfileSelection options={options.clothingGraphic.default} state={setClothingGraphic} label={"clothing graphic"} />
          </Tab>
          <Tab key="body" title="👨">
            <ProfileSelection options={options.facialHair.default} state={setFacialHair} label={"facial hair"} />
            <ProfileSelection options={options.facialHairColor.default} state={setFacialHairColor} label={"facial hair color"} />
            <ProfileSelection options={options.mouth.default} state={setMouth} label={"mouth"} />
            <ProfileSelection options={options.skinColor.default} state={setSkinColor} label={"skin color"} />
          </Tab>
          <Tab key="hair" title="🙆">
            <ProfileSelection options={options.top.default} state={setTop} label={"top"} />
            <ProfileSelection options={options.hairColor.default} state={setHairColor} label={"hair color"} />
          </Tab>
          <Tab key="eyes" title="👁️">
            <ProfileSelection options={options.eyebrows.default} state={setEyebrows} label={"eyebrows"} />
            <ProfileSelection options={options.eyes.default} state={setEyes} label={"eyes"} />
          </Tab>
        </Tabs>
      </div>
      <div className="m-4 flex flex-col items-center w-full">
        {/* <Input
            type="text"
            label="Username"
            variant="bordered"
            value={username}
            onValueChange={setUsername}
            className="max-w-xs"
          /> 
        */}
        <br />
        <Button
          color="primary"
          variant="ghost"
          className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </section>
  );
};

export default ProfileCard;
