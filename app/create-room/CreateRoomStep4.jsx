"use client";

import { Card, CardBody, User, Chip, Button, Divider } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { colorsForTeams } from "../lib/utils";

const CreateRoomStep4 = ({
  selectedRoles,
  nbrUserPlayers,
  preferredRole,
  username,
  onPrevious,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const nbrCPUPlayers = selectedRoles.length - nbrUserPlayers;

  return (
    <div className="flex flex-col gap-6">

      {/* Players Summary */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardBody className="p-6">

          <h3 className="text-white text-lg font-semibold mb-4">
            {t("create.summary")}
          </h3>

          {/* Selected Roles */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedRoles.map((r, i) => (
              <User
                key={r.name + i}
                avatarProps={{
                  size: "sm",
                  src: r.image,
                  radius: "lg",
                }}
                className={`p-1 rounded-lg shadow-sm`}
                style={{
                  backgroundColor: colorsForTeams[r.team] || "rgba(255,255,255,0.1)"
                }}
              />
            ))}
          </div>

          <Divider className="my-4" />

          {/* Text Summary */}
          <div className="space-y-2 text-white text-sm">
            <p>
              <strong>{selectedRoles.length}</strong> {t("create.totalPlayers")}
            </p>
            <p>
              • <strong>{nbrUserPlayers}</strong> {t("create.userControlled")}
            </p>
            <p>
              • <strong>{nbrCPUPlayers}</strong> {t("create.CPUControlled")}
            </p>

            {preferredRole && (
              <p className="font-bold mt-4">
                {username}: {preferredRole}
              </p>
            )}
          </div>

        </CardBody>
      </Card>

      {/* Info Box */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg p-4">
        <p className="text-white/70 text-sm flex items-center gap-2">
          <span className="text-lg">ℹ️</span>
          <span>{t("create.info.reviewBeforeStart")}</span>
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-2">
        <Button color="secondary" variant="shadow" onClick={onPrevious} size="lg" className="font-semibold">
          ← {t("create.previousStep")}
        </Button>
        <Button color="primary" variant="shadow" onClick={onSubmit} size="lg" className="font-semibold flex-1">
          {t("create.submit")} 🚀
        </Button>
      </div>
    </div>
  );
};

export default CreateRoomStep4;
