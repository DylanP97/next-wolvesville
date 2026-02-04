import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import i18n from '../lib/i18n';
import { useSound } from '../providers/SoundProvider';

// Team-based styling configuration
const getTeamStyles = (team) => {
    switch (team) {
        case 'Werewolves':
            return {
                gradient: 'from-red-950 via-red-900 to-black',
                border: 'border-red-500',
                innerBorder: 'border-red-400/30',
                accent: 'text-red-200',
                glow: 'shadow-red-500/50',
                imageBorder: 'border-red-500',
                badgeBg: 'bg-red-600',
                shuffleGradient: 'from-red-800 to-red-950',
            };
        case 'Village':
        case 'Villagers':
            return {
                gradient: 'from-emerald-900 via-green-800 to-emerald-950',
                border: 'border-emerald-400',
                innerBorder: 'border-emerald-300/30',
                accent: 'text-emerald-100',
                glow: 'shadow-emerald-400/40',
                imageBorder: 'border-emerald-400',
                badgeBg: 'bg-emerald-600',
                shuffleGradient: 'from-emerald-700 to-emerald-900',
            };
        default: // Solo roles
            return {
                gradient: 'from-violet-950 via-purple-900 to-indigo-950',
                border: 'border-violet-400',
                innerBorder: 'border-violet-300/30',
                accent: 'text-violet-200',
                glow: 'shadow-violet-500/50',
                imageBorder: 'border-violet-400',
                badgeBg: 'bg-violet-600',
                shuffleGradient: 'from-violet-800 to-violet-950',
            };
    }
};

const RoleReveal = ({ role, onComplete }) => {
    const [stage, setStage] = useState('shuffle');
    const { t } = useTranslation();
    const { generateNoise } = useSound();
    const styles = getTeamStyles(role?.team);

    useEffect(() => {
        generateNoise("wheelSpin");
    }, []);

    useEffect(() => {
        const shuffleTimer = setTimeout(() => {
            setStage('reveal');
        }, 2500);

        const completeTimer = setTimeout(() => {
            setStage('done');
            onComplete();
        }, 10000);

        return () => {
            clearTimeout(shuffleTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    if (stage === 'done') return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="flex flex-col items-center gap-8">
                {stage === 'shuffle' && (
                    <div className="relative w-72 h-96">
                        {[0, 1, 2, 3, 4].map((index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 bg-gradient-to-br ${styles.shuffleGradient} rounded-3xl shadow-2xl border-2 ${styles.border} overflow-hidden`}
                                style={{
                                    animation: `cardShuffle 0.8s ease-in-out infinite`,
                                    animationDelay: `${index * 0.08}s`,
                                    transform: `rotate(${index * 2}deg) translateY(${index * -3}px)`,
                                }}
                            >
                                {/* Card back pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)`,
                                        backgroundSize: '20px 20px'
                                    }} />
                                </div>
                                <div className={`absolute inset-4 border ${styles.innerBorder} rounded-2xl flex items-center justify-center`}>
                                    <div className="relative">
                                        <h2 className="text-white/80 text-[180px] font-bold text-center drop-shadow-lg font-wolf">
                                            ?
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {stage === 'reveal' && (
                    <div className="animate-scaleIn flex flex-col items-center">
                        {/* Main card container */}
                        <div className={`relative w-80 h-[480px] rounded-2xl shadow-2xl ${styles.glow} overflow-hidden border-2 ${styles.border}`}>
                            {/* Background image - full visibility */}
                            {role?.image2 ? (
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                                    style={{ backgroundImage: `url(${role.image2})` }}
                                />
                            ) : (
                                <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient}`} />
                            )}

                            {/* Bottom gradient for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

                            {/* Role icon - top left */}
                            <div className="absolute top-4 left-4">
                                <div className={`w-20 h-20 rounded-full border-3 ${styles.imageBorder} overflow-hidden bg-black/50 shadow-xl`}>
                                    {role?.image ? (
                                        <Image
                                            src={role.image}
                                            alt={role.name}
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700" />
                                    )}
                                </div>
                            </div>

                            {/* Team badge - top right */}
                            {role?.team && (
                                <div className="absolute top-4 right-4">
                                    <div className={`${styles.badgeBg} px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg`}>
                                        {i18n.language === "fr" ? role.teamFR : role.team}
                                    </div>
                                </div>
                            )}

                            {/* Text content - bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                {/* "You are the..." text */}
                                <p className={`${styles.accent} text-sm font-medium tracking-wide uppercase mb-2`}>
                                    {t("game.youAre")}
                                </p>

                                {/* Role name */}
                                <h2 className="text-white text-4xl font-bold drop-shadow-lg font-wolf mb-4">
                                    {i18n.language === "fr"
                                        ? role?.nameFR || 'Unknown Role'
                                        : role?.name || 'Unknown Role'}
                                </h2>

                                {/* Role description */}
                                <p className="text-gray-200 text-sm leading-relaxed">
                                    {i18n.language === "fr"
                                        ? role?.descriptionFR || 'Unknown Description'
                                        : role?.description || 'Unknown Description'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes cardShuffle {
                    0%, 100% {
                        transform: translateX(0) rotate(0deg);
                    }
                    25% {
                        transform: translateX(-15px) rotate(-3deg);
                    }
                    75% {
                        transform: translateX(15px) rotate(3deg);
                    }
                }

                @keyframes scaleIn {
                    0% {
                        transform: scale(0.8) rotateY(90deg);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.05) rotateY(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1) rotateY(0deg);
                        opacity: 1;
                    }
                }

                .animate-scaleIn {
                    animation: scaleIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default RoleReveal;