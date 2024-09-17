"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { useAuth } from "./providers/AuthProvider";
import GoBackBtn from "./components/GoBackBtn";
import { useTranslation } from "react-i18next";

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

  return (
    <div className="flex flex-col justify-between flex-grow w-full bg-background p-4">
      <h1 className="text-white text-3xl font-bold">{t("menu.1")}</h1>
      {rooms.length === 0 ? (
        <div className="m-4">
          <p className="text-white">{t("join.noroom")}</p>
        </div>
      ) : (
        rooms.map((room) => {
          let usersInTheRoom = room.usersInTheRoom;
          return (
            <Card key={room.id} className="m-4">
              <CardBody>
                {/* <p>id: {room.id}</p> */}
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
                {usersInTheRoom.length < room.nbrOfPlayers &&
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
                    color="danger"
                    variant="ghost"
                    onClick={() => deleteRoom(room.id)}
                  >
                    {t("join.deleteRoom")}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })
      )}
      <GoBackBtn />
    </div>
  );
};

export default JoinRoom;
