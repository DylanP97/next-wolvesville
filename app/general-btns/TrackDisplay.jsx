"use client";

import { useEffect, useRef, useState } from "react";
import { useSound } from "../providers/SoundProvider";
import { useAuth } from "../providers/AuthProvider";
import { useToRender } from "../providers/RenderProvider";

const TrackDisplay = () => {
  const { isPlaying } = useAuth();
  const { currentTrack, isMuted } = useSound();   // ⬅️ ADDED isMuted

  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [scrollNeeded, setScrollNeeded] = useState(false);

  const formatDuration = (ms) => {
    if (!ms) return "";
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}'${s < 10 ? "0" : ""}${s}"`;
  };

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const textWidth = textRef.current.scrollWidth;
    const containerWidth = containerRef.current.clientWidth;
    setScrollNeeded(textWidth > containerWidth);
  }, [currentTrack]);

  if (!currentTrack?.meta?.title ||
    isPlaying ||
    isMuted) return null;

  return (
    <>
      <div
        ref={containerRef}
        className="bg-purple-800 h-10 w-40 z-50 my-2 px-2 rounded-xl text-sm flex justify-center items-center border-2 border-white overflow-hidden"
      >
        <div className="marquee-container">
          <div className={scrollNeeded ? "marquee" : "static-text"} ref={textRef}>
            🎵 {formatDuration(currentTrack.meta.ms)} —{" "}
            {currentTrack.meta.title} - {currentTrack.meta.artist}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
          white-space: nowrap; /* FORCE ONE LINE */
        }

        .static-text {
          white-space: nowrap;
        }

        .marquee {
          display: inline-block;
          white-space: nowrap;
          animation: scroll-left 7s linear infinite;
          padding-right: 2rem;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-75%);
          }
        }
      `}</style>
    </>
  );
};

export default TrackDisplay;
