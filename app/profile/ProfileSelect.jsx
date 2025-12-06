"use client";

import { Select, SelectItem } from "@nextui-org/react";

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

export default ProfileSelect;
