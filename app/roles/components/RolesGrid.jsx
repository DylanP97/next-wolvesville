"use client";

import RoleCard from "./RoleCard";
import { Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import GoBackBtn from "../../components/GoBackBtn";
import { useTranslation } from "react-i18next";

const RolesGrid = () => {
  const [availableRoles, setAvailableRoles] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    // Fetch available roles from the server
    const fetchRoles = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/roles"
        );
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
    <section className="p-5 bg-[#303030]">
      <h1 className="text-white text-3xl font-bold p-4">{t("roles.title")}</h1>
      <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4 p-5">
        {availableRoles
          .sort((a, b) => a.status - b.status)
          .map((role) => (
            <RoleCard key={role.name} role={role} />
          ))}
      </div>
      <Divider className="my-4" />
      <GoBackBtn />
    </section>
  );
};

export default RolesGrid;
