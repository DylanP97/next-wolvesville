"use client"

import { Select, SelectItem } from "@nextui-org/react";

const ProfileSelection = ({ options, state, label }) => {
    return (
        <Select
            label={`Select ${label}`}
            className="max-w-xs h-14 w-full my-2"
        >
            {options.map((option) => {
                return (
                    <SelectItem key={option} value={option} onClick={() => state(option)}>
                        {option}
                    </SelectItem>
                )
            })}
        </Select>
    );
}

export default ProfileSelection