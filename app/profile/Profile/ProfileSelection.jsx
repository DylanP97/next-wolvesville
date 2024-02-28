"use client"

import { Select, SelectItem } from "@nextui-org/react";

const ProfileSelection = ({ options, state, label, value }) => {
    return (
        <Select
            label={`Select ${label}`}
            placeholder={value}
            variant="underline"
            className="w-full my-1 w-full"
        >
            {options.map((option) => {
                return (
                    <SelectItem key={option} value={value} onClick={() => state(option)} className="text-black">
                        {option}
                    </SelectItem>
                )
            })}
        </Select>
    );
}

export default ProfileSelection