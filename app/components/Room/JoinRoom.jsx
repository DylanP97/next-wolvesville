"use client";

import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import React from "react";
import { useAuth } from "../../providers/AuthProvider";

const JoinRoom = () => {
  const { rooms } = useAuth();

  const joinRoom = () => {
    // Emit an event to notify the server about the join request
    socket.emit("joinRoom", roomId);
    console.log("joinRoom function");
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
          return (
            <Card key={room.id} className="m-4">
              <CardBody>
                <p>Room Id: {room.id}</p>
                <p>Room name: {room.name}</p>
                <p>Room creator: {room.createdBy}</p>
              </CardBody>
              <Divider className="my-2" />
              <Button color="secondary" variant="ghost" onClick={() => joinRoom(room.id)}>
                Join Room
              </Button>
            </Card>
          );
        })
      )}
      <Button color="primary" variant="ghost" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
};

export default JoinRoom;
