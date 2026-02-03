"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Chip,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useTranslation } from "react-i18next";
import { btnClassNames } from "../lib/styles";
import RoleSelectionModal from "./RoleSelectionModal";
import { fetchRoles } from "../lib/fetch";
import { preloadImages } from "../lib/preloadImages";

// Icons
import { Users, Bot, Clock, Trash2 } from "lucide-react";

const JoinRoom = () => {
  const { t } = useTranslation();
  const { rooms, username, socketId, avatar, socket, updateUserGameState } =
    useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesData = await fetchRoles();
        setAvailableRoles(rolesData || []);

        // Preload role images into browser cache
        if (rolesData) {
          const imageUrls = rolesData.flatMap((r) => [r.image, r.image2]);
          preloadImages(imageUrls);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchData();
  }, []);

  const joinRoom = (roomId, userJoining, preferredRole = null) => {
    updateUserGameState(roomId, false);
    socket.emit("joinRoom", roomId, { ...userJoining, preferredRole });
  };

  const handleJoinClick = (room) => {
    if (room.allowRoleSelection && !room.isLaunched) {
      setSelectedRoom(room);
      setShowRoleModal(true);
    } else {
      joinRoom(room.id, { username, socketId, avatar });
    }
  };

  const handleRoleConfirm = (selectedRole) => {
    if (selectedRoom) {
      joinRoom(selectedRoom.id, { username, socketId, avatar }, selectedRole);
      setSelectedRoom(null);
    }
    setShowRoleModal(false);
  };

  const deleteRoom = (roomId) => {
    socket.emit("deleteRoom", roomId);
  };

  return (
    <div className="relative pt-[70px] flex flex-col w-full p-4 min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black">
      <h1 className="text-white text-4xl font-bold font-wolf mb-8 tracking-tight">
        {t("menu.1")}
      </h1>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-20">
          <div className="bg-zinc-800/50 border-2 border-dashed border-zinc-700 rounded-2xl w-32 h-32 flex items-center justify-center mb-8">
            <Users className="w-16 h-16 text-zinc-600" />
          </div>
          <p className="text-xl text-gray-400 italic">{t("join.noroom")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => {
            const usersInTheRoom = room.usersInTheRoom || [];
            const isCreator = username === room.createdBy;
            const alreadyInRoom = usersInTheRoom.some(
              (usr) => usr.username === username
            );
            const roomIsFull = usersInTheRoom.length >= room.nbrOfPlayers;
            const canJoin =
              !room.isLaunched &&
              !room.hasEnded &&
              !alreadyInRoom &&
              !roomIsFull;

            const spotsLeft =
              room.nbrOfPlayers - usersInTheRoom.length - room.nbrCPUPlayers;

            return (
              <Card
                key={room.id}
                className={`relative overflow-hidden transition-all duration-300 border-2
                  ${room.hasEnded
                    ? "border-gray-600 opacity-60 grayscale"
                    : room.isLaunched
                      ? "border-green-500/80 shadow-2xl shadow-green-500/30"
                      : canJoin
                        ? "border-amber-500/70 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:border-amber-400"
                        : "border-zinc-700"
                  }
                  bg-zinc-900/95 backdrop-blur-md
                `}
              >
                {room.isLaunched && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent pointer-events-none" />
                )}

                <CardBody className="pb-3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-wide truncate max-w-[180px]">
                        {room.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {t("join.createdBy")} <span className="font-medium text-gray-300">{room.createdBy}</span>
                      </p>
                    </div>

                    <Chip
                      size="sm"
                      variant="flat"
                      className={`font-bold text-xs
                        ${room.isLaunched
                          ? "bg-green-600/90 text-white animate-pulse"
                          : room.hasEnded
                            ? "bg-red-900/80 text-white"
                            : roomIsFull
                              ? "bg-gray-700 text-gray-300"
                              : "bg-amber-600/90 text-white"
                      }`}
                    >
                      {room.isLaunched
                        ? t("join.theRoomIsLaunched").replace("La partie", "EN JEU")
                        : room.hasEnded
                          ? "FINIE"
                          : roomIsFull
                            ? t("join.theRoomIsFull")
                            : `${usersInTheRoom.length}/${room.nbrOfPlayers}`}
                    </Chip>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-5 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span>{usersInTheRoom.length} {t("join.players")}</span>
                      </div>
                      {room.nbrCPUPlayers > 0 && (
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-cyan-400" />
                          <span>{room.nbrCPUPlayers} CPU</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(room.id).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {usersInTheRoom.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {usersInTheRoom.map((user, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 bg-zinc-800/70 px-3 py-1.5 rounded-full text-xs text-gray-300 border border-zinc-700"
                          >
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                            {user.username}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardBody>

                <Divider className="bg-zinc-800" />

                <CardFooter className="flex justify-between items-center pt-4 gap-4">
                  <div className="text-sm text-gray-400">
                    {canJoin && spotsLeft > 0 && (
                      <span>
                        {spotsLeft} {t("join.NbrLeftToJoin")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Join Button - only if can join */}
                    {canJoin && (
                      <Button
                        size="md"
                        color="primary"
                        variant="shadow"
                        className="font-bold tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-lg"
                        onClick={() => handleJoinClick(room)}
                      >
                        {t("join.joinRoom")}
                      </Button>
                    )}

                    {/* Full room message */}
                    {roomIsFull && !room.isLaunched && (
                      <span className="text-sm text-gray-500 italic">
                        {t("join.theRoomIsFull")}
                      </span>
                    )}

                    {/* Launched message */}
                    {room.isLaunched && (
                      <span className="text-sm text-green-400 font-medium italic">
                        {t("join.theRoomIsLaunched")}
                      </span>
                    )}

                    {/* Ended game */}
                    {room.hasEnded && (
                      <span className="text-sm text-red-400 italic">
                        {t("join.gameHasEnded")}
                      </span>
                    )}

                    {/* Winning team */}
                    {room.winningTeam && (
                      <span className="text-sm text-yellow-400 font-medium">
                        Équipe gagnante : {room.winningTeam.name}
                      </span>
                    )}

                    {/* Delete button for creator */}
                    {isCreator && !room.isLaunched && !room.hasEnded && (
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        onClick={() => deleteRoom(room.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedRoom(null);
        }}
        onConfirm={handleRoleConfirm}
        availableRoles={availableRoles}
        room={selectedRoom}
        username={username}
      />
    </div>
  );
};

export default JoinRoom;