"use client";

import { useMemo, useState } from "react";
import AvatarUI from "./AvatarUI";
import ProfileSelection from "./ProfileSelection"
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { schema } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

const ProfileCard = ({ username }) => {
  const [playerEmail, setPlayerEmail] = useState("");
  const [size, setSize] = useState(null);
  const [accessories, setAccessories] = useState(null);
  const [accessoriesColor, setAccessoriesColor] = useState(null);
  const [backgroundType, setBackgroundType] = useState(null);
  const [clothesColor, setClothesColor] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [clothingGraphic, setClothingGraphic] = useState(null);
  const [eyebrows, setEyebrows] = useState(null);
  const [eyes, setEyes] = useState(null);
  const [facialHair, setFacialHair] = useState(null);
  const [facialHairColor, setFacialHairColor] = useState(null);
  const [hairColor, setHairColor] = useState(null);
  const [hatColor, setHatColor] = useState(null);
  const [mouth, setMouth] = useState(null);
  const [skinColor, setSkinColor] = useState(null);
  const [top, setTop] = useState(null);

  const options = {
    ...schema.properties,
    ...avataaars.schema.properties,
  };

  const validateEmail = (value) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = useMemo(() => {
    if (playerEmail === "") return false;

    return validateEmail(playerEmail) ? false : true;
  }, [playerEmail]);

  return (
    <section className="w-full p-5 flex flex-col justify-center items-center ">
      <div className="flex flex-col gap-3">
        <h1 className="font-bold text-xl text-white">Edit Your Profile {username || "Guest"}</h1>
        <AvatarUI heightAndWidth={140} size={size} accessories={accessories} accessoriesColor={accessoriesColor} clothesColor={clothesColor} clothing={clothing} clothingGraphic={clothingGraphic} eyebrows={eyebrows} eyes={eyes} facialHair={facialHair} facialHairColor={facialHairColor} hairColor={hairColor} hatColor={hatColor} mouth={mouth} skinColor={skinColor} top={top} />
      </div>

      <div className="mx-6 my-4 flex flex-col items-center w-[400px]">
          <ProfileSelection options={options.accessories.default} state={setAccessories} label={"accessories"} />
          <ProfileSelection options={options.accessoriesColor.default} state={setAccessoriesColor} label={"accessories color"} />
          <ProfileSelection options={options.clothesColor.default} state={setClothesColor} label={"clothes color"} />
          <ProfileSelection options={options.clothing.default} state={setClothing} label={"clothing"} />
          <ProfileSelection options={options.clothingGraphic.default} state={setClothingGraphic} label={"clothing graphic"} />
          <ProfileSelection options={options.eyebrows.default} state={setEyebrows} label={"eyebrows"} />
          <ProfileSelection options={options.eyes.default} state={setEyes} label={"eyes"} />
          <ProfileSelection options={options.facialHair.default} state={setFacialHair} label={"facial hair"} />
          <ProfileSelection options={options.facialHairColor.default} state={setFacialHairColor} label={"facial hair color"} />
          <ProfileSelection options={options.hairColor.default} state={setHairColor} label={"hair color"} />
          <ProfileSelection options={options.hatColor.default} state={setHatColor} label={"hat color"} />
          <ProfileSelection options={options.mouth.default} state={setMouth} label={"mouth"} />
          <ProfileSelection options={options.skinColor.default} state={setSkinColor} label={"skin color"} />
          <ProfileSelection options={options.top.default} state={setTop} label={"top"} />
        {/* <Input
            type="text"
            label="Username"
            variant="bordered"
            value={username}
            onValueChange={setUsername}
            className="max-w-xs"
          />
          <br />
          <Input
            type="email"
            label="Email"
            variant="bordered"
            value={playerEmail}
            defaultValue="johndoe@email.com"
            onValueChange={setPlayerEmail}
            isInvalid={isInvalid}
            color={isInvalid && "error"}
            errorMessage={isInvalid && "Please enter a valid email"}
            className="max-w-xs"
          /> */}
        <br />
        <Button
          color="primary"
          variant="ghost"
          className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        // onClick={handleNameSubmit}
        >
          Submit
        </Button>
      </div>
    </section>
  );
};

export default ProfileCard;
