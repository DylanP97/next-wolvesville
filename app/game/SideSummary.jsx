"use client";

import { Button, User } from "@nextui-org/react";
import { useGame } from "./GameProvider";
import CrossIcon from "../components/icons/CrossIcon";
import { useTranslation } from "react-i18next";

const SideSummary = ({ summaryIsOpen, setSummaryIsOpen }) => {
  const { t } = useTranslation();
  const { playersList } = useGame();

  return (
    <div className="bg-background w-[30%] min-w-[250px] rounded-l-3xl flex flex-col items-center absolute top-0 right-0 z-40 p-4 overflow-y-auto max-h-[80vh] mt-4">
      <div className="mb-2 flex flex-row w-full items-center justify-items-stretch">
        <h3 className="flex-grow font-bold">{t("game.sideSummary.title")}</h3>
        <Button
          color="secondary"
          variant="solid"
          onClick={() => setSummaryIsOpen(!summaryIsOpen)}
          isIconOnly
        >
          <CrossIcon />
        </Button>
      </div>
      {[...playersList]
        .sort((a, b) => a.role.name.localeCompare(b.role.name))
        .map((ply) => (
          <User
            key={`${ply.id}-ssumrole`}
            avatarProps={{
              size: "md",
              src: ply.role.image,
              radius: "xl",
            }}
            className="p-2 w-full flex justify-start items-center"
            name={
              <p
                className={`${
                  !ply.isAlive && "line-through"
                } text-xs text-gray-200`}
              >
                {ply.name} {ply.isRevealed ? "Revealed" : "???"}
              </p>
            }
          />
        ))}
    </div>
  );
};

export default SideSummary;
