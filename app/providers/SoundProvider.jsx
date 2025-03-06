"use client";

import { createContext, useContext, useState, useEffect } from "react";
import tracksData from "../lib/tracks";

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [currentBgMusic, setCurrentBgMusic] = useState(null);
  const [bgMusicVolume, setBgMusicVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState(null);
  const tracks = tracksData.map((track) => ({
    title: track.title,
    artist: track.artist,
    ms: track.ms,
    path: track.path,
  }));

  useEffect(() => {
    // Cleanup audio when component unmounts
    return () => {
      if (currentBgMusic) {
        currentBgMusic.pause();
        currentBgMusic.currentTime = 0;
      }
    };
  }, [currentBgMusic]);

  useEffect(() => {
    // Update the volume of the current background music whenever bgMusicVolume changes
    if (currentBgMusic) {
      currentBgMusic.volume = bgMusicVolume;
    }
  }, [bgMusicVolume, currentBgMusic]);

  const playRandomTrack = () => {
    const randomIndex = Math.floor(Math.random() * tracks.length);
    const randomTrack = tracks[randomIndex];
    playTrack(randomTrack);
  };

  const playTrack = (track) => {
    if (currentBgMusic) {
      currentBgMusic.pause();
      currentBgMusic.currentTime = 0;
    }

    let newBgMusic = new Audio(track.path);

    newBgMusic.volume = bgMusicVolume;
    newBgMusic.play();
    setCurrentBgMusic(newBgMusic);
    setCurrentTrack(track);

    newBgMusic.onended = () => {
      if (currentBgMusic) {
        // Play the same special role track
        playTrack(track);
      } else {
        // Play the next track when current track ends
        playRandomTrack();
      }
    };
  };

  const generateBackgroundMusic = () => {
    if (!currentBgMusic) {
      // Start playing random track if no track is currently playing
      playRandomTrack();
    }
  };

  const generateNoise = (sound) => {
    console.log(sound);
    if (currentBgMusic) {
      setBgMusicVolume(0.2);
    }

    let newNoise;

    switch (sound) {
      case "wolfHowl":
        newNoise = new Audio("/audio/wolfHowling.mp3");
        break;
      case "rooster":
        newNoise = new Audio("/audio/rooster.mp3");
        break;
      case "pianoPercussion":
        newNoise = new Audio("/audio/pianoPercussion.mp3");
        break;
      case "grunt":
        newNoise = new Audio("/audio/grunt.mp3");
        break;
      case "selectionError":
        newNoise = new Audio("/audio/selectionError.mp3");
        break;
      case "gunshot":
        newNoise = new Audio("/audio/gunshot.mp3");
        break;
      default:
        return;
    }

    // console.log("newNoise", newNoise)

    newNoise.volume = 1;
    newNoise.play();

    newNoise.onended = () => {
      if (currentBgMusic) {
        setBgMusicVolume(0.5);
      }
    };
  };

  return (
    <SoundContext.Provider
      value={{
        generateNoise,
        generateBackgroundMusic,
        bgMusicVolume,
        setBgMusicVolume,
        playTrack,
        currentTrack,
        setCurrentBgMusic,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
