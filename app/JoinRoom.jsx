"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { useAuth } from "./providers/AuthProvider";
import { useTranslation } from "react-i18next";
import { btnClassNames } from "./lib/styles";

const JoinRoom = () => {
  const { t } = useTranslation();
  const { rooms, username, socketId, avatar, socket, updateUserGameState } =
    useAuth();

  const joinRoom = (roomId, userJoining) => {
    updateUserGameState(roomId, false, null);
    socket.emit("joinRoom", roomId, userJoining);
  };

  const deleteRoom = (roomId) => {
    socket.emit("deleteRoom", roomId);
  };

  console.log(rooms)


  return (
    <div className="relative pt-[70px] flex flex-col w-full p-4">
      <h1 className="text-white text-3xl font-bold font-wolf">{t("menu.1")}</h1>

      {rooms.length === 0 ? (
        <div className="m-4 flex justify-center items-center h-full">
          <p className="text-white italic ">{t("join.noroom")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {rooms.map((room) => {
            let usersInTheRoom = room.usersInTheRoom;
            return (
              <Card
                key={room.id}
                className={`${room.isLaunched
                    ? "animate-pulse bg-yellow-500 cursor-not-allowed"
                    : !room.isLaunched && usersInTheRoom.length < room.nbrOfPlayers && !usersInTheRoom.some((usr) => usr.username === username)
                      ? "bg-green-400"
                      : ""
                  } max-w-96 w-full`}
              >
                <CardBody>
                  <p>{room.name}</p>
                  <p>
                    {t("join.createdBy")} {room.createdBy}
                  </p>
                  <p>
                    {room.nbrOfPlayers} {t("join.playersIncluding")}{" "}
                    {room.nbrCPUPlayers} CPU
                  </p>
                  <p>{t("join.currentlyInTheRoom")}</p>
                  {usersInTheRoom.map((userInRoom, index) => (
                    <p key={"uitr" + index}>{userInRoom.username}</p>
                  ))}
                </CardBody>

                <Divider className="my-2" />

                <CardFooter className="flex flex-col items-start">
                  {!room.isLaunched && usersInTheRoom.length < room.nbrOfPlayers &&
                    !usersInTheRoom.some((usr) => usr.username === username) && (
                      <Button
                        className="w-full hover:text-white hover:scale-[105%]"
                        color="secondary"
                        variant="solid"
                        onClick={() =>
                          joinRoom(room.id, { username, socketId, avatar })
                        }
                      >
                        {t("join.joinRoom")}
                      </Button>
                    )}

                  {usersInTheRoom.length == room.nbrOfPlayers && (
                    <p className="p-2">{t("join.theRoomIsFull")}</p>
                  )}

                  {username == room.createdBy && (
                    <Button
                      className={btnClassNames}
                      color="danger"
                      variant="ghost"
                      onClick={() => deleteRoom(room.id)}
                    >
                      {t("join.deleteRoom")}
                    </Button>
                  )}

                  {room.isLaunched && (
                    <p className="text-center italic ">{t("join.theRoomIsLaunched")}</p>
                  )}


                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JoinRoom;
