"use client";

import RoleCard from "./RoleCard";
import { Button, Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";

const RolesGrid = () => {
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    // Fetch available roles from the server
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/roles");
        if (response.ok) {
          const rolesData = await response.json();
          setAvailableRoles(rolesData);
        } else {
          console.error("Failed to fetch roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <section className="mb-10 p-5">
      <h1 className="text-white text-3xl font-bold p-4">List of Roles</h1>
      <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4 p-5">
        {availableRoles.map((role) => (
          <RoleCard key={role.name} role={role} />
        ))}
      </div>
      <Divider className="my-4" />
      <Button color="primary" variant="ghost" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </section>
  );
};

export default RolesGrid;
