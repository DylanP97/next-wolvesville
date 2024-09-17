"use client";

import { Chip } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

const RoleStatusChip = ({ status }) => {
  const { t } = useTranslation();

  return (
    <>
      {status > 0 && (
        <Chip
          color={
            status == 1
              ? "success"
              : status == 2
              ? "warning"
              : status == 3 && "danger"
          }
          size="sm"
          variant="flat"
        >
          {status == 1
            ? t("roles.status1")
            : status == 2
            ? t("roles.status2")
            : status == 3 && t("roles.status3")}
        </Chip>
      )}
    </>
  );
};

export default RoleStatusChip;
