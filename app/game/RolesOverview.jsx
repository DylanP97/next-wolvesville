"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const BLUR_PLACEHOLDER =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAL0lEQVQYlWN89+7dfwYGBgYmBjIBEwMDAyMjIyMDMTYwMjIyEGUDAwMDAxMDmQAAiYwHAWB+PVQAAAAASUVORK5CYII=";
import i18n from '../lib/i18n';
import { useAuth } from '../providers/AuthProvider';

// Team-based styling for role cards
const getCardStyles = (team) => {
    switch (team) {
        case 'Werewolves':
            return {
                bg: 'bg-gradient-to-br from-red-950/80 to-black/80',
                border: 'border-red-500/40',
                hoverBorder: 'hover:border-red-400',
                imageBorder: 'border-red-500/60',
                nameColor: 'text-red-100',
                descColor: 'text-red-200/80',
                glow: 'hover:shadow-red-500/20',
            };
        case 'Village':
        case 'Villagers':
            return {
                bg: 'bg-gradient-to-br from-emerald-950/80 to-black/80',
                border: 'border-emerald-500/40',
                hoverBorder: 'hover:border-emerald-400',
                imageBorder: 'border-emerald-500/60',
                nameColor: 'text-emerald-100',
                descColor: 'text-emerald-200/80',
                glow: 'hover:shadow-emerald-500/20',
            };
        default: // Solo roles
            return {
                bg: 'bg-gradient-to-br from-violet-950/80 to-black/80',
                border: 'border-violet-500/40',
                hoverBorder: 'hover:border-violet-400',
                imageBorder: 'border-violet-500/60',
                nameColor: 'text-violet-100',
                descColor: 'text-violet-200/80',
                glow: 'hover:shadow-violet-500/20',
            };
    }
};

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

    const RoleCard = ({ role }) => {
        const styles = getCardStyles(role?.team);

        return (
            <div className={`group relative rounded-2xl border ${styles.border} ${styles.hoverBorder} transition-all duration-300 hover:scale-[1.02] overflow-hidden min-h-[280px]`}>
                {/* Background image - high visibility */}
                {role?.image2 ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                        style={{ backgroundImage: `url(${role.image2})` }}
                    />
                ) : (
                    <div className={`absolute inset-0 ${styles.bg}`} />
                )}

                {/* Bottom gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Role icon - top left */}
                <div className="absolute top-3 left-3">
                    <div className={`w-12 h-12 rounded-full border-2 ${styles.imageBorder} overflow-hidden bg-black/50 shadow-lg`}>
                        {role?.image ? (
                            <Image
                                src={role.image}
                                alt={role.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                                placeholder="blur"
                                blurDataURL={BLUR_PLACEHOLDER}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-700" />
                        )}
                    </div>
                </div>

                {/* Text content - bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-bold text-sm mb-1">
                        {i18n.language === "fr" ? role?.nameFR : role?.name}
                    </h3>
                    <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                        {i18n.language === "fr" ? role?.descriptionFR : role?.description}
                    </p>
                </div>
            </div>
        );
    };

    const TeamSection = ({ title, roles, teamType }) => {
        const sectionStyles = {
            village: {
                bg: 'bg-emerald-950/30',
                border: 'border-emerald-500/30',
                titleColor: 'text-emerald-300',
                icon: '🏠'
            },
            werewolves: {
                bg: 'bg-red-950/30',
                border: 'border-red-500/30',
                titleColor: 'text-red-300',
                icon: '🐺'
            },
            solo: {
                bg: 'bg-violet-950/30',
                border: 'border-violet-500/30',
                titleColor: 'text-violet-300',
                icon: '🎭'
            }
        }[teamType];

        return (
            <div className={`rounded-2xl p-5 ${sectionStyles.bg} border ${sectionStyles.border} backdrop-blur-sm`}>
                <h2 className={`${sectionStyles.titleColor} text-xl font-bold mb-4 flex items-center gap-3 font-wolf tracking-wide`}>
                    <span className="text-2xl">{sectionStyles.icon}</span>
                    {title}
                    <span className="text-sm font-normal opacity-60 font-sans">({roles.length})</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {roles.map((role, index) => (
                        <RoleCard key={`${role.name}-${index}`} role={role} />
                    ))}
                </div>
            </div>
        );
    };

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
                        teamType="village"
                    />
                )}

                {/* Werewolf roles */}
                {groupedRoles.werewolves.length > 0 && (
                    <TeamSection
                        title={t("teams.werewolves") || "Werewolves"}
                        roles={groupedRoles.werewolves}
                        teamType="werewolves"
                    />
                )}

                {/* Solo roles */}
                {groupedRoles.solo.length > 0 && (
                    <TeamSection
                        title={t("teams.solo") || "Solo"}
                        roles={groupedRoles.solo}
                        teamType="solo"
                    />
                )}
            </div>


        </div>
    );
};

export default RolesOverview;
