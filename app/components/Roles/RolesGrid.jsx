"use client";

import RoleCard from "./RoleCard";
import roles from "../../lib/roles";
import { Button, Divider } from "@nextui-org/react";

const RolesGrid = () => {
  return (
    <section className="mb-10">
      <h1 className="text-white text-3xl font-bold p-4">List of Roles</h1>
      <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4">
        {roles.map((role) => (
          <RoleCard key={role.name} role={role} />
        ))}
      </div>
      <Divider className="my-2" />
      <Button color="primary" variant="ghost" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </section>
  );
};

export default RolesGrid;
