import { Input, User } from "@nextui-org/react";
import i18n from "./lib/i18n";
import Image from "next/image";

const RoleChoice = ({ role, handleRoleChange }) => {
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

  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex flex-row justify-center items-center gap-2">
        <div
          className="h-8 w-8 rounded-xl bg-gray-600 flex justify-center items-center cursor-pointer hover:bg-gray-500"
          onClick={handleDecrement}
        >
          <Image
            src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1720704973/minus_nvg56t.png"
            alt="minus"
            width={20}
            height={20}
            className="m-auto"
          />
        </div>
        <div className="h-8 w-8 rounded-xl bg-gray-200 flex justify-center items-center">
          <p className="text-black">{role.count}</p>
        </div>

        <div
          className="h-8 w-8 rounded-xl bg-gray-600 flex justify-center items-center cursor-pointer hover:bg-gray-500"
          onClick={handleIncrement}
        >
          <Image
            src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1720704972/plus_flbowi.png"
            alt="plus"
            width={20}
            height={20}
            className="m-auto"
          />
        </div>
      </div>
      <User
        avatarProps={{
          size: "sm",
          src: role.image,
          radius: "xl",
        }}
        className="p-1"
        name={
          <p className="text-xs text-gray-200 ">
            {i18n.language === "fr" ? role.nameFR : role.name}
            {` (${role.team})`}
          </p>
        }
      />
    </div>
  );
};

export default RoleChoice;
