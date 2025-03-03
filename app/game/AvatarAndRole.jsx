"use client";

import Image from "next/image";
import AvatarUI from "../components/AvatarUI"; 
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18n";

const AvatarAndRole = ({ ply, alive }) => {
  const { t } = useTranslation();

  return (
    <div
      key={ply.name + "--wo-div"}
      className="flex flex-col items-center w-44"
    >
      <div className="flex relative">
        <Image
          src={ply.role.image}
          alt={ply.role.name + "--wo-icon"}
          height={40}
          width={40}
          style={{ height: "auto", width: "auto" }}
          className="p-2 absolute top-[-15%] left-[55%]"
        />
        <div className="p-2 rounded-full">
          {ply.avatar ? (
            <AvatarUI heightAndWidth={40} avatar={ply.avatar} />
          ) : (
            <Image
              src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1717510105/cpu_ir0roq.png"
              alt="cpu-player-avatar"
              height={40}
              width={40}
              style={{ height: "auto", width: "auto" }}
              className="w-6 h-6"
            />
          )}
        </div>
      </div>
      <p className="m-2 text-white text-xs text-clip italic">
        {ply.name} {alive ? t("winnerOverlay.as") : t("winnerOverlay.wasA")} {" "}
        {i18n.language === "fr" ? ply.role.nameFR : ply.role.name}
      </p>
    </div>
  );
};

export default AvatarAndRole;
