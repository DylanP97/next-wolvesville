"use client";

import RoleCard from "./RoleCard";
import { useEffect, useState } from "react";
import GoBackBtn from "./components/GoBackBtn";
import { useTranslation } from "react-i18next";
import { fetchRoles } from "./lib/fetch";
import { ScrollShadow } from "@nextui-org/react";

const RolesGrid = () => {
  const [availableRoles, setAvailableRoles] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const rolesData = await fetchRoles();
      setAvailableRoles(rolesData);
    };

    fetchData();
  }, []);

  return (
    <section className="flex flex-col w-full p-4 mb-12">
      <h1 className="text-white text-3xl font-bold p-5 font-wolf">{t("roles.title")}</h1>
      <div className="flex flex-row gap-6 p-4 overflow-x-auto md:overflow-x-hidden md:flex-wrap">
        {availableRoles
          .sort((a, b) => a.status - b.status)
          .map((role) => (
            <RoleCard key={role.name} role={role} />
          ))}
      </div>
      <div className="px-5 py-2">
        <GoBackBtn />
      </div>
    </section>
  );
};

export default RolesGrid;
