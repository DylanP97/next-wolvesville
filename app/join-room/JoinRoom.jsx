"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { useAuth } from "../providers/AuthProvider";
import GoBackBtn from "../components/GoBackBtn";
import { useTranslation } from "react-i18next";

const JoinRoom = () => {
  const { t } = useTranslation();
  const { rooms, username, socketId, avatar, socket, updateGameState } =
    useAuth();

  const joinRoom = (roomId, userJoining) => {
    updateGameState(null, false, null);
    socket.emit("joinRoom", roomId, userJoining);
  };

  const deleteRoom = (roomId) => {
    socket.emit("deleteRoom", roomId);
  };

  return (
    <div className="flex flex-col justify-between flex-grow w-full bg-[#303030] p-4">
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
                <p>id: {room.id}</p>
                <p>name: {room.name}</p>
                <p>creator: {room.createdBy}</p>
                <p>
                  {room.nbrOfPlayers} players including {room.nbrCPUPlayers} CPU
                </p>
                <p>currently in the room :</p>
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
                      Join Room
                    </Button>
                  )}
                {usersInTheRoom.length == room.nbrOfPlayers && (
                  <p className="p-2">The room is full</p>
                )}
                {username == room.createdBy && (
                  <Button
                    color="danger"
                    variant="ghost"
                    onClick={() => deleteRoom(room.id)}
                  >
                    Delete Room
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
