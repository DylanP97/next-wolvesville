"use client"

import { Chip } from "@nextui-org/react"

const RoleStatusChip = ({
    status
}) => {

    return (
        <>
            {status > 0 && (
                <Chip color={
                    status == 1 ? "success" :
                        status == 2 ? "warning" :
                            status == 3 && "danger"}
                    size="sm" variant="flat">
                    {(
                        status == 1 ? 'Available' :
                            status == 2 ? 'Half-Playable' :
                                status == 3 && 'Not Working'
                    )}
                </Chip>
            )}
        </>
    )
}

export default RoleStatusChip