"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";
import RoleStatusChip from "./RoleStatusChip";
import i18n from "./lib/i18n";
import { useTranslation } from "react-i18next";

const RoleCard = ({ role }) => {
  const { t } = useTranslation();
  const teamsString = role.team.join(", ");

  return (
    <Card className="min-w-80 h-60 md:max-w-80">
      <CardHeader className="flex gap-3">
        <Image
          alt={role.name}
          height={80}
          width={80}
          radius="xl"
          src={role.image}
          />
        <div className="flex flex-col">
          <p className="text-md">
            {i18n.language === "fr" ? role.nameFR : role.name}
          </p>
          <p className="text-xs text-default-500">
            {t("roles.team")}
            {role.team.length > 1 && "s"}: {teamsString}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-xs">
          {i18n.language === "fr" ? role.descriptionFR : role.description}
        </p>
      </CardBody>
      <CardFooter>
        <RoleStatusChip status={role.status} />
      </CardFooter>
    </Card>
  );
};

export default RoleCard;
