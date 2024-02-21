"use client";

import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import React from "react";
import { useAuth } from "../providers/AuthProvider";

const JoinRoom = () => {
  const { rooms, username, socketId, avatar, socket } = useAuth();

  const joinRoom = (roomId, userJoining) => {
    socket.emit("joinRoom", roomId, userJoining);
  };

  const deleteRoom = (roomId) => {
    socket.emit('deleteRoom', roomId)
  };


  return (
    <div className="w-full bg-black p-4">
      <h1 className="text-white text-3xl font-bold">Join a room</h1>
      {rooms.length === 0 ? (
        <div className="m-4">
          <p className="text-white">There are no rooms to join currently</p>
        </div>
      ) : (
        rooms.map((room) => {
          let usersInTheRoom = room.usersInTheRoom
          return (
            <Card key={room.id} className="m-4">
              <CardHeader>
                <p>id: {room.id}</p>
              </CardHeader>
              <CardBody>
                <p>name: {room.name}</p>
                <p>creator: {room.createdBy}</p>
                <p>nbr of players: {room.nbrOfPlayers}</p>
                <p>currently in the room :</p>
                {
                  usersInTheRoom.map((userInRoom, index) => <p key={"uitr" + index}>{userInRoom.username}</p>)
                }
              </CardBody>
              <CardFooter>
                {
                  usersInTheRoom.length < room.nbrOfPlayers &&
                  !usersInTheRoom.some((usr) => usr.username === username) && (
                    <Button color="secondary" variant="ghost" onClick={() => joinRoom(room.id, { username, socketId, avatar })}>
                      Join Room
                    </Button>
                  )
                }
                {
                  usersInTheRoom.length == room.nbrOfPlayers && <p className="p-2" >The room is full</p>
                }
                {
                  (username == room.createdBy) && (
                    <Button color="danger" variant="ghost" onClick={() => deleteRoom(room.id)}>
                      Delete Room
                    </Button>
                  )
                }
              </CardFooter>
            </Card>
          )
        })
      )}
      <Button color="primary" variant="ghost" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
};

export default JoinRoom;
