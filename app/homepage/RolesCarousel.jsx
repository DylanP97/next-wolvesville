"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { fetchRoles } from "../lib/fetch";
import i18n from "../lib/i18n";

const CARD_WIDTH = 160;
const CARD_HEIGHT = 200;
const CARD_SPACING = 120;
const SPEED = 1.2;

const TEAM_COLORS = {
  Werewolves: { border: '#991b1b99', glow: '0 0 20px rgba(153,27,27,0.4)', shine: 'rgba(255,80,80,0.15)' },
  Solo: { border: '#6b21a899', glow: '0 0 20px rgba(107,33,168,0.4)', shine: 'rgba(180,80,255,0.15)' },
  Village: { border: '#075985aa', glow: '0 0 20px rgba(7,89,133,0.4)', shine: 'rgba(80,180,255,0.15)' },
};

const RolesCarousel = () => {
  const [roles, setRoles] = useState([]);
  const [shuffledRoles, setShuffledRoles] = useState([]);
  const scrollRef = useRef(0);
  const timeRef = useRef(0);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const rolesData = await fetchRoles();
      setRoles(rolesData || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      const active = roles.filter(role => role.status === 1);
      setShuffledRoles([...active].sort(() => Math.random() - 0.5));
    }
  }, [roles]);

  const totalCards = shuffledRoles.length;
  const totalWidth = totalCards * CARD_SPACING;

  const updateCard = useCallback((card, shine, index, scroll, containerWidth, time) => {
    if (totalCards === 0) return;

    const centerX = containerWidth / 2;
    let x = (index * CARD_SPACING - scroll) % totalWidth;
    if (x < -CARD_SPACING) x += totalWidth;
    if (x > totalWidth) x -= totalWidth;

    const cardCenterX = x + CARD_WIDTH / 2;
    const distFromCenter = cardCenterX - centerX;
    const maxDist = containerWidth / 2 + CARD_WIDTH;
    const nd = Math.max(-1, Math.min(1, distFromCenter / maxDist)); // normalized distance
    const absNd = Math.abs(nd);

    // Floating bob - each card has its own phase offset
    const floatY = Math.sin(time * 0.002 + index * 1.8) * (4 + absNd * 3);

    // Scale with a punchy ease - center card pops bigger
    const centerPunch = Math.max(0, 1 - absNd * 2.5); // 0-1, sharp peak at center
    const scale = 0.65 + (1 - absNd) * 0.35 + centerPunch * 0.12;

    // 3D rotations
    const rotateY = nd * 45;
    const rotateX = absNd * -4; // slight top tilt on sides
    const rotateZ = nd * -5;

    // Depth
    const translateZ = (1 - absNd) * 80 + centerPunch * 30;

    // Opacity
    const opacity = Math.max(0, 1 - absNd * 0.7);

    // Z-index
    const zIndex = Math.round((1 - absNd) * 100);

    // Dynamic shadow based on distance from center
    const shadowBlur = 10 + (1 - absNd) * 25;
    const shadowOpacity = 0.2 + (1 - absNd) * 0.3;

    // Shine position - sweeps across as card moves through center
    const shinePos = 50 + nd * 120;
    const shineOpacity = centerPunch;

    card.style.left = `${x}px`;
    card.style.transform = `translateY(calc(-50% + ${floatY}px)) perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) translateZ(${translateZ}px) scale(${scale})`;
    card.style.opacity = opacity;
    card.style.zIndex = zIndex;
    card.style.filter = `drop-shadow(0 ${shadowBlur / 2}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity}))`;

    if (shine) {
      shine.style.opacity = shineOpacity;
      shine.style.background = `linear-gradient(105deg, transparent ${shinePos - 30}%, rgba(255,255,255,0.15) ${shinePos}%, transparent ${shinePos + 30}%)`;
    }
  }, [totalCards, totalWidth]);

  // Animation loop
  useEffect(() => {
    if (totalCards === 0) return;

    const animate = (timestamp) => {
      timeRef.current = timestamp;
      scrollRef.current += SPEED;
      if (scrollRef.current >= totalWidth) {
        scrollRef.current -= totalWidth;
      }

      const container = containerRef.current;
      if (container) {
        const containerWidth = container.offsetWidth;
        const cards = container.querySelectorAll('.carousel-card');
        cards.forEach((card, i) => {
          const shine = card.querySelector('.card-shine');
          updateCard(card, shine, i, scrollRef.current, containerWidth, timestamp);
        });
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [totalCards, totalWidth, updateCard]);

  const getTeamStyle = useCallback((team) => {
    return TEAM_COLORS[team] || TEAM_COLORS.Village;
  }, []);

  return (
    <div className="flex justify-center items-center z-30">
      <div
        ref={containerRef}
        className="carousel-container"
      >
        {shuffledRoles.map((role, index) => {
          const teamStyle = getTeamStyle(role.team);

          return (
            <div
              key={role.name + "-carousel"}
              className="carousel-card"
              style={{
                position: 'absolute',
                top: '50%',
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                className="relative w-full h-full rounded-xl overflow-hidden"
                style={{
                  border: `1px solid ${teamStyle.border}`,
                  boxShadow: teamStyle.glow,
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                }}
              >
                {/* Background image */}
                {role.image2 && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-50 pointer-events-none"
                    style={{ backgroundImage: `url(${role.image2})` }}
                  />
                )}

                {/* Team-colored vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${teamStyle.shine} 0%, transparent 70%)`,
                  }}
                />

                {/* Bottom gradient for text */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

                {/* Shine sweep overlay */}
                <div
                  className="card-shine absolute inset-0 pointer-events-none rounded-xl"
                  style={{ opacity: 0 }}
                />

                {/* Role icon */}
                <div className="absolute top-2 left-2 z-10">
                  <Image
                    height={40}
                    width={40}
                    src={role.image}
                    alt={role.name}
                    priority
                    style={{ height: "auto" }}
                    className="drop-shadow-lg"
                  />
                </div>

                {/* Role name and team */}
                <div className="absolute bottom-0 inset-x-0 z-10 p-2.5">
                  <p className="text-white text-sm font-wolf leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {i18n.language === "fr" ? role.nameFR : role.name}
                  </p>
                  <p className="text-slate-400 text-[10px] mt-0.5 drop-shadow-md">
                    {i18n.language === "fr" ? role.teamFR : role.team}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RolesCarousel;
