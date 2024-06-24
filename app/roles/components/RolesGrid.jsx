"use client";

import RoleCard from "./RoleCard";
import { useEffect, useState } from "react";
import GoBackBtn from "../../components/GoBackBtn";
import { useTranslation } from "react-i18next";
import { fetchRoles } from "../../lib/fetch";

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
    <section className="p-5 bg-background mb-12">
      <h1 className="text-white text-3xl font-bold p-5">{t("roles.title")}</h1>
      <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 p-5">
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
