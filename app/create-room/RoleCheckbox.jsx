// RoleCheckbox.js

import { Input, User } from "@nextui-org/react";
import { useState } from "react";
import { colorsForTeams } from "../lib/utils";

const RoleCheckbox = ({ role, onChange }) => {
  const [nbrOf, setNbrOf] = useState(0);
  const isSolo = !["village", "werewolves"].includes(role.team.join());

  const handleNbrOfChange = (event) => {
    const newValue = Number(event.target.value);
    setNbrOf(newValue);
    onChange(role.name, newValue); // Pass the role name and the new value to the parent component
  };

  return (
    <div className="flex flex-row w-[80%] gap-2 justify-start">
      <div className="flex gap-2">
        <Input
          color="secondary"
          type="number"
          className="m-1 bg-white rounded-xl"
          defaultValue={nbrOf}
          labelPlacement="outside"
          size="md"
          min={0}
          max={isSolo ? 1 : 3}
          onChange={handleNbrOfChange}
        />
      </div>
      <User
        avatarProps={{
          size: "md",
          src: role.image,
          radius: "lg",
        }}
        className={`p-1 bg-[${colorsForTeams[role.team.join()]}]`}
        description={<p className="text-sm">@{role.team}</p>}
        name={<p className="text-sm text-gray-200">{role.name}</p>}
      />
    </div>
  );
};

export default RoleCheckbox;
