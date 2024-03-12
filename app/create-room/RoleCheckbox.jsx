"use client"

import { Checkbox, User, cn } from "@nextui-org/react";
import RoleStatusChip from "../roles/components/RoleStatusChip"

const RoleCheckbox = ({
    role
}) => {

    return (
        <Checkbox
            aria-label={role.name}
            classNames={{
                base: cn(
                    "inline-flex w-full max-w-md bg-content1",
                    "hover:bg-content2 items-center justify-start",
                    "cursor-pointer rounded-lg gap-2 px-4 py-2 m-1 border-2 border-transparent",
                    "data-[selected=true]:border-primary",
                ),
                label: "w-full",
            }}
            value={role}
        >
            <div className="w-full flex justify-between gap-2">
                <User
                    avatarProps={{ size: "md", src: role.image, color: "secondary", isBordered: true, radius: "lg" }}
                    description={
                        <p className="text-sm text-blue-500">
                            @{role.team}
                        </p>
                    }
                    name={role.name}
                    className=""
                />
                <RoleStatusChip
                    status={role.status}
                />
            </div>
        </Checkbox>
    );
}

export default RoleCheckbox;
