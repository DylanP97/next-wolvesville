"use client";

import { Card, CardBody, Select, SelectItem, Button, User } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

const CreateRoomStep3 = ({
  preferredRole,
  handleRoleSelection,
  getAvailableRolesForSelection,
  availableRoles,
  onNext,
  onPrevious,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">

      {/* Role Selection Card */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardBody className="p-6">

          <h3 className="text-white text-lg font-semibold mb-4">
            {t("create.preferredRoleTitle") || t("create.preferredRole")}
          </h3>

          <Select
            label={t("create.preferredRole")}
            placeholder={t("create.selectRole")}
            className="max-w-xs bg-white rounded-xl"
            selectedKeys={preferredRole ? [preferredRole] : []}
            onSelectionChange={handleRoleSelection}
          >
            {getAvailableRolesForSelection().map((role) => (
              <SelectItem
                key={role.name}
                value={role.name}
                startContent={
                  <img src={role.image} alt={role.name} className="w-6 h-6 rounded" />
                }
              >
                {role.name}
              </SelectItem>
            ))}
          </Select>

          {preferredRole && (
            <div className="mt-6 flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl p-3">
              <User
                name={preferredRole}
                avatarProps={{
                  size: "sm",
                  src: availableRoles.find((r) => r.name === preferredRole)?.image,
                  radius: "lg",
                }}
                className="text-white"
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Info Box */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
        <p className="text-white/70 text-sm flex items-center gap-2">
          <span className="text-lg">💡</span>
          <span>{t("create.info.preferredRole")}</span>
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button className="font-semibold" color="secondary" variant="shadow" onClick={onPrevious} size="lg">
          ← {t("create.previousStep")}
        </Button>
        <Button className={`font-semibold  flex-1`} color="primary" variant="shadow" onClick={onNext} size="lg" >
          {t("create.nextStep")} →
        </Button>
      </div>
    </div>
  );
};

export default CreateRoomStep3;
