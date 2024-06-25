"use client";

import { useEffect, useState } from "react";
import { useSound } from "../providers/SoundProvider";
import { useAuth } from "../providers/AuthProvider";

const TrackDisplay = () => {
  const { isPlaying } = useAuth();
  const { currentTrack } = useSound();
  const [isNewSong, setIsNewSong] = useState(false);

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}'${seconds < 10 ? "0" : ""}${seconds}"`;
  };

  useEffect(() => {
    if (currentTrack) {
      setIsNewSong(true);
      setTimeout(() => {
        setIsNewSong(false);
      }, 5000); // Duration for which the TrackDisplay will be visible
    }
  }, [currentTrack]);

  if (currentTrack && !isPlaying) {
    return (
      <div
        className={`track-display rounded-xl w-fit m-4 ${
          isNewSong ? "fade-in p-4 animate-pulse" : "fade-out"
        }`}
      >
        <p className="text-white text-xs">Now playing:</p>
        <p className="text-white text-sm">
          {currentTrack.title} - {currentTrack.artist}
        </p>
        <p className="text-white text-xs">{formatDuration(currentTrack.ms)}</p>
      </div>
    );
  }
};

export default TrackDisplay;
