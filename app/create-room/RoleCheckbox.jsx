import { Input, User } from "@nextui-org/react";
import i18n from "../lib/i18n";

const RoleCheckbox = ({ role, handleRoleChange }) => {
  const isSolo = !["village", "werewolves"].includes(role.team.join());
  const allowMultiple = ["Villager", "Classic Werewolf"].includes(
    role.name
  );

  const handleNbrOfChange = (event) => {
    handleRoleChange(role.name, Number(event.target.value));
  };

  return (
    <div className="flex flex-row gap-2 justify-start">
      <div className="flex gap-2">
        <Input
          color="secondary"
          type="number"
          className="m-1 bg-white rounded-xl"
          value={role.count}
          labelPlacement="outside"
          size="sm"
          min={0}
          max={allowMultiple ? 3 : 1}
          onChange={handleNbrOfChange}
        />
      </div>
      <User
        avatarProps={{
          size: "sm",
          src: role.image,
          radius: "xl",
        }}
        className="p-1"
        name={
          <p className="text-sm text-gray-200">
            {i18n.language === "fr" ? role.nameFR : role.name}
            {` (${role.team})`}
          </p>
        }
      />
    </div>
  );
};

export default RoleCheckbox;
