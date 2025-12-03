"use client";

import { useEffect, useState } from "react";
import { useSound } from "./providers/SoundProvider";
import { useAuth } from "./providers/AuthProvider";
import { btnPrimary, getBtnClassNames } from "./lib/styles";

const TrackDisplay = () => {
  const { isPlaying } = useAuth();
  const { currentTrack } = useSound();

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}'${seconds < 10 ? "0" : ""}${seconds}"`;
  };

  if (currentTrack && !isPlaying) {
    return (
      <div
        className={`${btnPrimary} h-fit w-fit z-50 p-4 my-2 rounded-xl text-sm absolute bottom-8 right-4 flex-col justify-start items-start hover:scale-[105%] transition-all hover:cursor-pointer border-2 border-white track-display `}
      >
        <p className="text-xs">🎵 Now playing:</p>
        <p className="text-sm">
          {currentTrack.meta.title} - {currentTrack.meta.artist}
        </p>
        <p className="text-white text-xs">{formatDuration(currentTrack.meta.ms)}</p>
      </div>
    );
  }
};

export default TrackDisplay;
