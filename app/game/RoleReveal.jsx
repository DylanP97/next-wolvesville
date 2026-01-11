import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import i18n from '../lib/i18n';
import { useSound } from '../providers/SoundProvider';

const RoleReveal = ({ role, onComplete }) => {
    const [stage, setStage] = useState('shuffle'); // 'shuffle' -> 'reveal' -> 'done'
    const { t } = useTranslation();
    const { generateNoise } = useSound();

    useEffect(() => {
        generateNoise("wheelSpin");
    }, []);


    useEffect(() => {
        // Shuffle animation for 2 seconds
        const shuffleTimer = setTimeout(() => {
            setStage('reveal');
        }, 2500);

        // Complete after 5 seconds total
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-8">
                {stage === 'shuffle' && (
                    <div className="relative w-64 h-80">
                        {/* Animated card shuffle effect */}
                        {[0, 1, 2, 3, 4].map((index) => (
                            <div
                                key={index}
                                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl border-4 border-yellow-400 overflow-hidden"
                                style={{
                                    animation: `cardShuffle 1s ease-in-out infinite`,
                                    animationDelay: `${index * 0.1}s`,
                                    transform: `rotate(${index * 3}deg) translateY(${index * -2}px)`,
                                }}
                            >
                                <div className="absolute inset-4 border-2 border-yellow-300/50 rounded-xl flex items-center justify-center">
                                    <h2 className="text-white text-[200px] font-bold text-center drop-shadow-lg font-wolf">
                                        ?
                                    </h2>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {stage === 'reveal' && (
                    <div className="animate-scaleIn flex flex-col items-center gap-6">
                        {/* Role card */}
                        <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl border-4 border-yellow-400 p-8 w-80 overflow-hidden">
                            {/* Image de fond avec transparence pour la carte révélée */}
                            {role?.image2 && (
                                <div 
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
                                    style={{
                                        backgroundImage: `url(${role.image2})`,
                                    }}
                                />
                            )}
                            
                            <div className="absolute inset-4 border-2 border-yellow-300/50 rounded-xl" />

                            <div className="relative z-10 flex flex-col items-center gap-4">
                                {/* Role image */}
                                <div className="w-40 h-40 rounded-full bg-white/10 border-4 border-yellow-400 flex items-center justify-center overflow-hidden">
                                    {role?.image ? (
                                        <Image
                                            src={role.image}
                                            alt={role.name}
                                            width={160}
                                            height={160}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400" />
                                    )}
                                </div>

                                {/* "You are the..." text */}
                                <p className="text-yellow-200 text-lg font-semibold tracking-wide">
                                    {t("game.youAre")}{" "}
                                </p>

                                {/* Role name */}
                                <h2 className="text-white text-4xl font-bold text-center drop-shadow-lg">
                                    {i18n.language === "fr"
                                        ? role?.nameFR || 'Unknown Role'
                                        : role?.name || 'Unknown Role'}
                                </h2>

                                {/* Team badge */}
                                {role?.team && (
                                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${role.team === 'Werewolves'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-green-600 text-white'
                                        }`}>
                                        {i18n.language === "fr"
                                            ? role.teamFR
                                            : role.team}
                                    </div>
                                )}

                                {/* Role description */}
                                <p className="text-yellow-200 text-center">
                                    {i18n.language === "fr"
                                        ? role?.descriptionFR || 'Unknown Description'
                                        : role?.description || 'Unknown Description'}
                                </p>
                            </div>
                        </div>

                        {/* Additional sparkle effects */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-sparkle"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                    }}
                                />
                            ))}
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
            transform: translateX(-20px) rotate(-5deg);
          }
          75% {
            transform: translateX(20px) rotate(5deg);
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default RoleReveal;