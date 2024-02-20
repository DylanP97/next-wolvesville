"use client"

import { Select, SelectItem } from "@nextui-org/react";

const ProfileSelection = ({ options, state, label, value }) => {
    return (
        <Select
            label={`Select ${label}`}
            variant="underline"
            className="max-w-xs h-20 w-full my-2"
        >
            {options.map((option) => {
                return (
                    <SelectItem key={option} value={value} onClick={() => state(option)}>
                        {option}
                    </SelectItem>
                )
            })}
        </Select>
    );
}

export default ProfileSelection