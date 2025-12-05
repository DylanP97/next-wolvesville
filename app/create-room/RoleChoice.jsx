import { Card, CardBody, Badge, Button } from "@nextui-org/react";
import Image from "next/image";
import i18n from "../lib/i18n";

const RoleChoice = ({ role, handleRoleChange }) => {
  const isSolo = !["Village", "Werewolves"].includes(role.team);
  const allowMultiple = ["Villager", "Classic Werewolf"].includes(role.name);
  const maxCount = allowMultiple ? 10 : 1;

  // Determine colors based on team
  const getTeamColors = () => {
    switch (role.team) {
      case "Village":
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-400/40",
          hover: "hover:bg-blue-500/30",
          glow: "shadow-blue-500/20"
        };
      case "Werewolves":
        return {
          bg: "bg-red-500/20",
          border: "border-red-400/40",
          hover: "hover:bg-red-500/30",
          glow: "shadow-red-500/20"
        };
      default: // Solo roles
        return {
          bg: "bg-purple-500/20",
          border: "border-purple-400/40",
          hover: "hover:bg-purple-500/30",
          glow: "shadow-purple-500/20"
        };
    }
  };

  const teamColors = getTeamColors();

  const handleIncrement = () => {
    if (role.count < maxCount) {
      handleRoleChange(role.name, role.count + 1);
    }
  };

  const handleDecrement = () => {
    if (role.count > 0) {
      handleRoleChange(role.name, role.count - 1);
    }
  };

  const displayName = i18n.language === "fr" ? role.nameFR : role.name;
  const displayTeam = i18n.language === "fr" ? role.teamFR : role.team;

  return (
    <Card className={`w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] ${teamColors.bg} backdrop-blur-sm border ${teamColors.border} ${teamColors.hover} transition-all duration-200 shadow-lg ${teamColors.glow}`}>
      <CardBody className="p-4 relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="">
            <img
              src={role.image}
              alt={displayName}
              className="w-14 h-14 rounded-lg object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">
              {displayName}
            </h3>
            <p className="text-white/60 text-xs truncate">{displayTeam}</p>
            <p className="text-white/50 text-xs italic">Max: {maxCount}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            isIconOnly
            size="sm"
            color="secondary"
            variant="flat"
            onClick={handleDecrement}
            isDisabled={role.count === 0}
            className="min-w-8 h-8"
          >
            <Image
              src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1720704973/minus_nvg56t.png"
              alt="minus"
              width={15}
              height={15}
            />
          </Button>
          <div className="flex-1 text-center">
            <span className="text-white font-bold text-lg">{role.count}</span>
          </div>
          <Button
            isIconOnly
            size="sm"
            color="primary"
            variant="flat"
            onClick={handleIncrement}
            isDisabled={role.count >= maxCount}
            className="min-w-8 h-8"
          >
            <Image
              src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1720704972/plus_flbowi.png"
              alt="plus"
              width={15}
              height={15}
            />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default RoleChoice;