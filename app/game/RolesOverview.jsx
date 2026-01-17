"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import i18n from '../lib/i18n';
import { useAuth } from '../providers/AuthProvider';

const RolesOverview = ({ rolesInGame, usersInTheRoom, onReady }) => {
    const { t } = useTranslation();
    const { socket, game, username } = useAuth();
    const [readyPlayers, setReadyPlayers] = useState([]);
    const [countdown, setCountdown] = useState(100);
    const [isReady, setIsReady] = useState(false);

    // Listen for ready updates and countdown
    useEffect(() => {
        if (!socket) return;

        const handleReadyUpdate = (data) => {
            setReadyPlayers(data.readyPlayers);
        };

        const handleCountdown = (time) => {
            setCountdown(time);
        };

        socket.on("playerReadyUpdate", handleReadyUpdate);
        socket.on("rolesOverviewCountdown", handleCountdown);

        return () => {
            socket.off("playerReadyUpdate", handleReadyUpdate);
            socket.off("rolesOverviewCountdown", handleCountdown);
        };
    }, [socket]);

    // Group roles by team
    const groupedRoles = {
        village: [],
        werewolves: [],
        solo: []
    };

    rolesInGame?.forEach(role => {
        if (role.team === "Werewolves") {
            groupedRoles.werewolves.push(role);
        } else if (role.team === "Village" || role.team === "Villagers") {
            groupedRoles.village.push(role);
        } else {
            // Solo roles (Serial Killer, Fool, Arsonist, Ghost Lady, etc.)
            groupedRoles.solo.push(role);
        }
    });

    const handleReadyClick = () => {
        if (!isReady && socket && game) {
            socket.emit("playerReady", game.id, username);
            setIsReady(true);
        }
    };

    const RoleCard = ({ role }) => (
        <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-yellow-400/50 transition-all hover:scale-105 overflow-hidden min-h-[350px]">
            {/* Background image2 */}
            {role?.image2 && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `url(${role.image2})`,
                    }}
                />
            )}

            <div className="relative z-10 flex flex-col items-center text-center gap-3">
                {/* Role image */}
                <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-yellow-400/50 flex-shrink-0 overflow-hidden">
                    {role?.image ? (
                        <Image
                            src={role.image}
                            alt={role.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400" />
                    )}
                </div>

                {/* Role info */}
                <div className="flex-1">
                    <h3 className="text-white font-bold text-sm">
                        {i18n.language === "fr" ? role?.nameFR : role?.name}
                    </h3>
                    <p className="text-gray-300 text-xs mt-2">
                        {i18n.language === "fr" ? role?.descriptionFR : role?.description}
                    </p>
                </div>
            </div>
        </div>
    );

    const TeamSection = ({ title, roles, bgColor, borderColor }) => (
        <div className={`rounded-2xl p-4 ${bgColor} border ${borderColor}`}>
            <h2 className="text-white text-xl font-bold mb-3 flex items-center gap-2">
                {title}
                <span className="text-sm font-normal opacity-70">({roles.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {roles.map((role, index) => (
                    <RoleCard key={`${role.name}-${index}`} role={role} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 overflow-hidden">

            {/* Scrollable roles content */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">

                {/* Header */}
                <div className="text-center py-6 px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-wolf">
                        {t("game.getReady") || "Get Ready!"}
                    </h1>
                    <p className="text-yellow-200 text-lg">
                        {t("game.getReadyDesc") || "The game is about to start. Review the roles and click ready when you're prepared."}
                    </p>
                </div>

                {/* Bottom bar - Ready status and button */}
                <div className="bg-black/50 backdrop-blur-md border-t border-white/10 p-4">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Ready players list */}
                        <div className="flex-1">
                            <p className="text-white text-sm mb-2">
                                {t("game.playersReady") || "Players Ready"}: {readyPlayers.length}/{usersInTheRoom?.length || 0}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {usersInTheRoom?.map((user) => (
                                    <div
                                        key={user.username}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${readyPlayers.includes(user.username)
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-600/50 text-gray-300'
                                            }`}
                                    >
                                        {user.username}
                                        {readyPlayers.includes(user.username) && ' ✓'}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Countdown and Ready button */}
                        <div className="flex flex-col items-center gap-2">
                            {/* Countdown timer */}
                            <p className={`text-sm ${countdown <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-200'}`}>
                                {t("game.autoStart") || "Game starting in"}: {countdown}s
                            </p>

                            {/* Ready button */}
                            <button
                                onClick={handleReadyClick}
                                disabled={isReady}
                                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all transform ${isReady
                                    ? 'bg-green-600 text-white cursor-default'
                                    : 'bg-yellow-500 hover:bg-yellow-400 text-black hover:scale-105 active:scale-95'
                                    }`}
                            >
                                {isReady ? (t("game.ready") || "Ready!") + " ✓" : (t("game.clickReady") || "I'm Ready!")}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center py-6 px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-wolf">
                        {t("game.rolesInGame") || "Roles in this Game"}
                    </h1>
                    <p className="text-yellow-200 text-lg">
                        {t("game.reviewRoles") || "Review the roles before the game starts"}
                    </p>
                </div>

                {/* Village roles */}
                {groupedRoles.village.length > 0 && (
                    <TeamSection
                        title={t("teams.village") || "Village"}
                        roles={groupedRoles.village}
                        bgColor="bg-green-900/30"
                        borderColor="border-green-500/30"
                    />
                )}

                {/* Werewolf roles */}
                {groupedRoles.werewolves.length > 0 && (
                    <TeamSection
                        title={t("teams.werewolves") || "Werewolves"}
                        roles={groupedRoles.werewolves}
                        bgColor="bg-red-900/30"
                        borderColor="border-red-500/30"
                    />
                )}

                {/* Solo roles */}
                {groupedRoles.solo.length > 0 && (
                    <TeamSection
                        title={t("teams.solo") || "Solo"}
                        roles={groupedRoles.solo}
                        bgColor="bg-purple-900/30"
                        borderColor="border-purple-500/30"
                    />
                )}
            </div>


        </div>
    );
};

export default RolesOverview;
