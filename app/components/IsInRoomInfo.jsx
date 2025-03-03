"use client";

import { useTranslation } from "react-i18next";

const IsInRoomInfo = ({ isInRoom }) => {
  const { t } = useTranslation();

  if (isInRoom)
    return (
      <p className="text-md text-white">
        🟢🎮 {t("home.status.1")} {isInRoom}
      </p>
    );
  else return <p className="text-md text-white">🔴🎮 {t("home.status.2")}</p>;
};

export default IsInRoomInfo;
