"use client";

import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import React from "react";
import { useAuth } from "../../providers/AuthProvider";

const JoinRoom = () => {
  const { rooms, username, socketId, socket } = useAuth();

  const joinRoom = (roomId, userJoining) => {
    socket.emit("joinRoom", roomId, userJoining);
  };

  const launchRoom = (room) => {
    socket.emit('launchRoom', room.id)
    // window.location.assign('/game')
  }
  
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
              <CardBody>
                <p>id: {room.id}</p>
                <p>name: {room.name}</p>
                <p>creator: {room.createdBy}</p>
                <p>nbr of players: {room.nbrOfPlayers}</p>
                <p>currently in the room :</p>
                {
                  usersInTheRoom.map((userInRoom, index) => <p key={"uitr"+index}>{userInRoom.username}</p>)
                }
              </CardBody>
              {
                usersInTheRoom.length < room.nbrOfPlayers &&
                usersInTheRoom.some((usr) => usr.username != username) && (
                  <Button color="secondary" variant="ghost" onClick={() => joinRoom(room.id, {username, socketId})}>
                    Join Room
                  </Button>
                )
              }
              {
                usersInTheRoom.length == room.nbrOfPlayers && <p>The room is full</p>
              }
              {
                (usersInTheRoom.length == room.nbrOfPlayers) && (username == room.createdBy) && (
                  <Button color="secondary" variant="ghost" onClick={() => launchRoom(room)}>
                    Launch Room
                  </Button>
                )
              }
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
