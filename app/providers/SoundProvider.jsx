"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [currentBgMusic, setCurrentBgMusic] = useState(null);
  const [bgMusicVolume, setBgMusicVolume] = useState(0.5); // Initial volume is 100%
  const [tracks, setTracks] = useState([
    "/audio/battleOfTheCreek.mp3",
    "/audio/breakingTheSiege.mp3",
    "/audio/chasingLight.mp3",
    "/audio/cobblestoneVillage.mp3",
    "/audio/lands.mp3",
    "/audio/medievalTown.mp3",
    "/audio/theMedievalBanquet.mp3",
    "/audio/wildBoarsInn.mp3",
    // Add more tracks as needed
  ]);

  useEffect(() => {
    // Cleanup audio when component unmounts
    return () => {
      if (currentBgMusic) {
        currentBgMusic.pause();
        currentBgMusic.currentTime = 0;
      }
    };
  }, [currentBgMusic]);

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

    let newBgMusic = new Audio(track);

    newBgMusic.volume = bgMusicVolume; // Set initial volume
    newBgMusic.play();
    setCurrentBgMusic(newBgMusic);

    newBgMusic.onended = () => {
      if (currentBgMusic) {
        // play same special role track
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

  const generateNoise = (audioType) => {
    console.log("hello generateNoise");
    if (currentBgMusic) {
      // Lower the volume of background music temporarily
      setBgMusicVolume(0.2); // Example: Reduce volume to 50%
    }

    let newNoise;

    switch (audioType) {
      case "wolfHowl":
        newNoise = new Audio("/audio/wolfHowling.mp3");
        break;
      case "rooster":
        newNoise = new Audio("/audio/rooster.mp3");
        break;
      case "pianoPercussion":
        newNoise = new Audio("/audio/pianoPercussion.mp3");
        break;
      default:
        return;
    }

    newNoise.volume = 1;
    newNoise.play();

    newNoise.onended = () => {
      if (currentBgMusic) {
        // Restore the volume of background music after noise ends
        setBgMusicVolume(0.5); // Restore volume to 100%
      }
    };
  };

  return (
    <SoundContext.Provider
      value={{
        generateNoise,
        generateBackgroundMusic,
        playTrack,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

// Hook to use the SoundContext
export const useSound = () => useContext(SoundContext);