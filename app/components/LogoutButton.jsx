"use client";

import { Button } from "@nextui-org/react";

const LogoutButton = () => {

    return (
        <Button variant="ghost" className="absolute top-4 right-4 z-10" color="danger" aria-label="Disconnect" onPress={() => document.location.assign('/')}>
            Disconnect
        </Button>
    )
}

export default LogoutButton