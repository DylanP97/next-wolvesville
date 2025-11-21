import { Card, CardBody, Badge, Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import RoleChoice from "./RoleChoice";

const CreateRoomStep1 = ({
  availableRoles,
  handleRoleChange,
  selectedRoles,
  onNext,
  errorMessage,
  autoFillRoles,
}) => {
  const { t } = useTranslation();
  const totalPlayers = selectedRoles.length;
  const isValid = totalPlayers >= 2 && totalPlayers <= 16;

  return (
    <div className="flex flex-col">
      {/* Summary Card */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 mb-4">
        <CardBody className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">
                {t("create.totalPlayers")}: {totalPlayers}
              </span>
              <div className="text-white/60 text-sm italic">
                {totalPlayers < 2 && t("create.error.numberOfPlayers")}
                {totalPlayers > 16 && t("create.error.numberOfPlayers")}
                {isValid && "✓ "}
              </div>
            </div>
            <div className="flex gap-2 mx-2 justify-center items-center">
              {
                totalPlayers === 0 ? (
                  <Button
                    color="secondary"
                    variant="bordered"
                    onClick={autoFillRoles}
                    size="md"
                    className="font-semibold"
                  >
                    {t("create.allRolesSelectBtn")}
                  </Button>
                ) : (
                  <Button
                    color="secondary"
                    variant="bordered"
                    onClick={autoFillRoles}
                    size="md"
                    className="font-semibold"
                  >
                    {t("create.allRolesUnSelectBtn")}
                  </Button>
                )
              }
            </div>
          </div>


          {/* Selected Roles Preview */}
          {totalPlayers > 0 && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex flex-wrap gap-2">
                {selectedRoles.slice(0, 8).map((role, i) => (
                  <img
                    key={i}
                    src={role.image}
                    alt={role.name}
                    className="w-8 h-8 rounded-full border-2 border-white/30"
                    title={role.name}
                  />
                ))}
                {selectedRoles.length > 8 && (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-semibold">
                    +{selectedRoles.length - 8}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Info Text */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-4 flex flex-row justify-center items-center">
        <div className="">
          <p className="text-white/70 text-sm flex items-center gap-2">
            <span className="text-lg">ℹ️</span>
            <span >{t("create.info.numberOnEachRole")}</span>
          </p>
        </div>
      </div>



      {/* Roles Grid */}
      <div className="flex flex-wrap gap-4 mb-6 overflow-x-auto">
        {availableRoles.map((role) => (
          <RoleChoice
            key={role.name + "-rolecheckbx"}
            role={role}
            handleRoleChange={handleRoleChange}
          />
        ))}
      </div>



      {/* Navigation Button */}
      <div className="flex flex-col gap-2">
        <Button
          color="primary"
          variant="shadow"
          onClick={onNext}
          isDisabled={!isValid}
          size="lg"
          className="font-semibold"
        >
          {t("create.nextStep")} →
        </Button>

        {errorMessage && (
          <p className="text-danger text-sm mt-2">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateRoomStep1;