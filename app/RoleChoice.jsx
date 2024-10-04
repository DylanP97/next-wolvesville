import { Button, Input, User } from "@nextui-org/react";
import i18n from "./lib/i18n";
import Image from "next/image";
import { getBtnClassNames } from "./lib/styles";
import { fetchTeamByName } from "./lib/fetch";
import { useEffect, useState } from "react";

const RoleChoice = ({ role, handleRoleChange }) => {
  const [teamName, setTeamName] = useState("");
  const isSolo = !["village", "werewolves"].includes(role.team.join());
  const allowMultiple = ["Villager", "Classic Werewolf"].includes(role.name);

  const handleIncrement = () => {
    if (allowMultiple && role.count < 3) {
      handleRoleChange(role.name, role.count + 1);
    } else if (!allowMultiple && role.count < 1) {
      handleRoleChange(role.name, role.count + 1);
    }
  };

  const handleDecrement = () => {
    if (role.count > 0) {
      handleRoleChange(role.name, role.count - 1);
    }
  };

  useEffect(() => {
    const fetchTeamName = async () => {
      const teamData = await fetchTeamByName(role.team.join());
      setTeamName(i18n.language === "fr" ? teamData.nameFR : teamData.name);
    };

    fetchTeamName();
  }, [role.team]);

  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex flex-row justify-center items-center gap-2">
        <Button
          isIconOnly
          size="sm"
          color="secondary"
          variant="solid"
          aria-label="volumeToggle"
          onClick={handleDecrement}
          className={getBtnClassNames("w-10")}
        >
          <Image
            src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1720704973/minus_nvg56t.png"
            alt="minus"
            width={15}
            height={15}
            className="m-auto"
          />
        </Button>

        <div className="h-10 z-20 p-2 my-2 rounded-xl text-sm text-center flex justify-center items-center hover:scale-[105%] transition-all hover:cursor-pointer border-2 border-secondary bg-white w-10">
          <p className="text-black">{role.count}</p>
        </div>

        <Button
          isIconOnly
          size="sm"
          color="secondary"
          variant="solid"
          aria-label="volumeToggle"
          onClick={handleIncrement}
          className={getBtnClassNames("w-10")}
        >
          <Image
            src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1720704972/plus_flbowi.png"
            alt="plus"
            width={15}
            height={15}
            className="m-auto"
          />
        </Button>
      </div>
      <User
        avatarProps={{
          size: "sm",
          src: role.image,
          radius: "xl",
        }}
        className="p-1"
        name={
          <p className="text-xs text-white">
            {i18n.language === "fr" ? role.nameFR : role.name}
            {` (${teamName})`} {/* Use the state value instead of the promise */}
          </p>
        }
      />
    </div>
  );
};

export default RoleChoice;
