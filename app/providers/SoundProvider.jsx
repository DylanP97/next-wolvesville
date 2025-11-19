"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import tracksData from "../lib/tracks";

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null); // { audio, meta, isSpecial }
  const [isMuted, setIsMuted] = useState(false);
  
  // Use ref to track the actual audio element independently
  const audioRef = useRef(null);

  const tracks = tracksData.map(t => ({ title: t.title, artist: t.artist, ms: t.ms, path: t.path }));

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Apply mute/unmute to current track using ref
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 1;
    }
  }, [isMuted]); // Remove currentTrack from dependencies

  /** Helper to create audio with mute applied */
  const createAudio = (path) => {
    if (typeof window === "undefined") return null;
    const audio = new Audio(path);
    audio.volume = isMuted ? 0 : 1;
    return audio;
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setCurrentTrack(null);
  };

  const playTrack = (trackMeta, isSpecial = false) => {
    // If the same track is already playing, don't restart it
    if (currentTrack?.meta?.title === trackMeta.title && audioRef.current) {
      return;
    }

    // Stop previous track
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Use createAudio to respect isMuted state
    const audio = createAudio(trackMeta.path);
    if (!audio) return;

    if (isSpecial) audio.loop = true;

    audio.play().catch(err => console.error("Audio play failed:", err));
    
    // Store in ref for mute control
    audioRef.current = audio;
    setCurrentTrack({ audio, meta: trackMeta, isSpecial });
  };

  const playRandomTrack = () => {
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    playTrack(randomTrack);
  };

  const generateBackgroundMusic = () => {
    if (!currentTrack) playRandomTrack();
  };

  const generateNoise = (sound) => {
    let file;
    switch (sound) {
      case "wolfHowl": file = "/audio/wolfHowling.mp3"; break;
      case "rooster": file = "/audio/rooster.mp3"; break;
      case "pianoPercussion": file = "/audio/pianoPercussion.mp3"; break;
      case "maleScreamFear": file = "/audio/maleScreamFear.mp3"; break;
      case "digitalFail": file = "/audio/digitalFail.mp3"; break;
      case "selectionError": file = "/audio/selectionError.mp3"; break;
      case "gunshot": file = "/audio/gunshot.mp3"; break;
      default: return;
    }

    const noise = createAudio(file); // respects isMuted
    noise?.play().catch(err => console.error("Noise play failed:", err));
  };

  return (
    <SoundContext.Provider
      value={{
        currentTrack,
        stopMusic,
        playTrack,
        playRandomTrack,
        generateBackgroundMusic,
        generateNoise,
        isMuted,
        setIsMuted,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);