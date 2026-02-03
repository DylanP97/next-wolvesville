"use client";

import RoleCard from "./RoleCard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchRoles } from "./lib/fetch";
import { Button, ScrollShadow } from "@nextui-org/react";
import { getBtnClassNames } from "./lib/styles";

const RolesGrid = ({ onBack }) => {
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
    <section className="flex flex-col w-full p-4 pt-[70px] mb-12">
      <h1 className="text-white text-3xl font-bold p-5 font-wolf">{t("roles.title")}</h1>
      <div className="flex flex-row gap-6 p-4 overflow-x-auto overflow-x-hidden flex-wrap">
        {availableRoles
          .filter((role) => role.status === 1)
          .sort((a, b) => a.status - b.status)
          .map((role) => (
            <RoleCard key={role.name} role={role} />
          ))}
      </div>
      {onBack && (
        <Button
          className={getBtnClassNames("w-80")}
          color="secondary"
          variant="shadow"
          onClick={onBack}
        >
          {t("goback")}
        </Button>
      )}
    </section>
  );
};

export default RolesGrid;