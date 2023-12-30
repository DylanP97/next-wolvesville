"use client";

import RoleCard from "./RoleCard";
import roles from "../../lib/roles";

const RolesGrid = () => {
  return (
    <section className="mb-10 py-16">
      <h2 className="text-white text-lg font-bold p-4">List of Roles</h2>
      <div className="w-full grid grid-cols-3 gap-4">
        {roles.map((role) => (
          <RoleCard key={role.name} role={role} />
        ))}
      </div>
    </section>
  );
};

export default RolesGrid;
