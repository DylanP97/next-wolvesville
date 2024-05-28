"use client";

import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useAuth } from "../../providers/AuthProvider";
import AvatarUI from "../../profile/components/AvatarUI";
import { useGame } from "../providers/GameProvider";
import { useTranslation } from "react-i18next";

const WinnerOverlay = () => {
  const { t } = useTranslation();
  const { updateGameState } = useAuth();
  const { winningTeam, aliveList } = useGame();

  const handleExitGame = () => {
    updateGameState(null, false, null);
    document.location.assign("/");
  };

  if (winningTeam) {
    return (
      <div
        className="winner-overlay"
        style={{
          zIndex: 999,
        }}
      >
        <div className="winner-message flex flex-col justify-center align-center">
          <Image
            src={winningTeam.image}
            alt="winner"
            height={80}
            width={80}
            className="mb-2 w-full max-h-16 object-contain"
          />
          <p className="mb-4">The {winningTeam.name} won!</p>
          <div className="flex flex-row justify-center mt-4">
            {aliveList.map((ply) => {
              return (
                <div
                  key={ply.name + "key-win-div"}
                  className="flex flex-col items-center w-44"
                >
                  <div className="flex relative">
                    <Image
                      src={ply.role.image}
                      alt={ply.role.name + "win-icon-76678"}
                      height={40}
                      width={40}
                      style={{ height: "auto", width: "auto" }}
                      className="p-2 absolute top-[-15%] left-[55%] "
                    />
                    <div className="p-2 bg-blue-500 rounded-full ">
                      {ply.avatar ? (
                        <AvatarUI heightAndWidth={80} avatar={ply.avatar} />
                      ) : (
                        <Image
                          src="https://res.cloudinary.com/dnhq4fcyp/image/upload/v1715954141/robot-game_ncwkv7.png"
                          height={80}
                          width={80}
                          alt="cpu-player-avatar"
                        />
                      )}
                    </div>
                  </div>
                  <p className="m-2 text-gray-200 text-sm text-clip italic">
                    {ply.name} as {ply.role.name}
                  </p>
                </div>
              );
            })}
          </div>
          <Button
            className="hover:animate-pulse hover:scale-[105%] w-60 transition-all text-white my-2"
            color="secondary"
            variant="ghost"
            onClick={() => handleExitGame()}
          >
            {t("goback")}
          </Button>
        </div>
      </div>
    );
  }
};

export default WinnerOverlay;
