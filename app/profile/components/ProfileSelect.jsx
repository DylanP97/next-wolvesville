"use client";

import { Select, SelectItem } from "@nextui-org/react";

const ProfileSelect = ({ label, options, currentValue, setAvState }) => {
  
  const updateState = (option) => {
    return setAvState((prevAvatar) => {
      return {
        ...prevAvatar,
        [label]: option,
      };
    });
  };

  return (
    <Select
      label={`Select ${label}`}
      placeholder={currentValue}
      variant="underline"
      className="w-full my-1 w-full"
    >
      {options.map((option) => {
        return (
          <SelectItem
            key={option}
            className="text-black"
            value={currentValue}
            onClick={() => updateState(option)}
          >
            {option}
          </SelectItem>
        );
      })}
    </Select>
  );
};

export default ProfileSelect;
