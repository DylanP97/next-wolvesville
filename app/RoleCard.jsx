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

  return (
    <Card className="min-w-80 h-60 md:max-w-80 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-200">
      <CardHeader className="flex gap-3">
        <Image
          alt={role.name}
          height={80}
          width={80}
          radius="xl"
          src={role.image}
          className="border border-slate-600"
          />
        <div className="flex flex-col">
          <p className="text-md font-semibold text-white">
            {i18n.language === "fr" ? role.nameFR : role.name}
          </p>
          <p className="text-xs text-slate-400">
            {t("roles.team")} 
            {i18n.language === "fr" ? ` : ${role.teamFR}` : `: ${role.team}`}
          </p>
        </div>
      </CardHeader>
      <Divider className="bg-slate-700" />
      <CardBody>
        <p className="text-xs text-slate-200">
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
