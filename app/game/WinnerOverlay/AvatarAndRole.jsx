"use client";

import Image from "next/image";
import AvatarUI from "../../components/AvatarUI";
import { useTranslation } from "react-i18next";
import i18n from "../../lib/i18n";

const AvatarAndRole = ({ ply, alive }) => {
  const { t } = useTranslation();

  return (
    <div
      key={ply.name + "--wo-div"}
      className="flex flex-col items-center min-w-0 w-full"
    >
      <div className="flex relative">
        <Image
          src={ply.role.image}
          alt={ply.role.name + "--wo-icon"}
          height={40}
          width={40}
          style={{ height: "auto", width: "auto" }}
          className="p-2 absolute top-[-15%] left-[55%] "
        />
        {ply.role.wasGraveRobber && (
          <Image
            src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706531396/roles/grave-robber_yc0x5n.png"
            alt={ply.role.name + "--wo-gr-icon"}
            height={40}
            width={40}
            style={{ height: "auto", width: "auto" }}
            className="p-2 absolute top-[-40%] left-[100%]"
          />
        )}
        {ply.role.wasCursed && (
          <Image
            src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1706531396/roles/cursed_omsixt.png"
            alt={ply.role.name + "--wo-cu-icon"}
            height={40}
            width={40}
            style={{ height: "auto", width: "auto" }}
            className="p-2 absolute top-[-40%] left-[100%] "
          />
        )}
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

      <p className="m-2 text-white text-xs text-center text-clip italic min-w-0">
        {ply.name} {alive ? t("winnerOverlay.as") : t("winnerOverlay.wasA")}{" "}
        {i18n.language === "fr" ? ply.role.nameFR : ply.role.name}{ply.role.wasGraveRobber && " " + t("winnerOverlay.wasGraveRobber")}{ply.role.wasCursed && " " + t("winnerOverlay.wasCursed")}
      </p>
    </div>
  );
};

export default AvatarAndRole;
