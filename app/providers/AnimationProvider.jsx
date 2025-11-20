"use client";

import { createContext, useContext, useState, useEffect } from "react";
import animationsData from "../lib/animations";

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [animationData, setAnimationData] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [simpleMessage, setSimpleMessage] = useState(null);
  const [Lottie, setLottie] = useState(null);

  useEffect(() => {
    // Dynamically import Lottie only on client side
    import("react-lottie").then((module) => {
      setLottie(() => module.default);
    });
  }, []);

  const triggerSimpleMessage = (text) => {
    setSimpleMessage(text);
    setShowAnimation(true);
    setFadeOut(false);

    setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setSimpleMessage(null);
        setShowAnimation(false);
      }, 500);
    }, 2000);
  };

  const triggerAnimation = async (animationName) => {
    const animation = animationsData.find((a) => a.title === animationName);
    if (animation) {
      setCurrentAnimation(animation);

      try {
        const response = await fetch(animation.path);
        if (!response.ok) throw new Error(`Failed to load animation`);

        const animationJSON = await response.json();
        setAnimationData(animationJSON);
        setShowAnimation(true);
        setFadeOut(false);

        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setShowAnimation(false);
            setCurrentAnimation(null);
            setAnimationData(null);
          }, 500);
        }, animation.ms);
      } catch (error) {
        console.error("Failed to load animation:", error);
      }
    }
  };

  return (
    <AnimationContext.Provider
      value={{ triggerAnimation, triggerSimpleMessage }}
    >
      <div>
        {children}
        {showAnimation && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              opacity: fadeOut ? 0 : 1,
              transition: "opacity 1.5s ease-out",
              // pointerEvents: "none", // Permet de cliquer à travers l'animation

            }}
          >
            {currentAnimation && animationData && Lottie && (
              <Lottie
                options={{
                  loop: false,
                  autoplay: true,
                  animationData: animationData,
                  rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
                }}
                height={400}
                width={400}
              />
            )}
            {simpleMessage && (
              <p className="text-3xl font-bold italic text-white bg-yellow-500 z-50 p-4 m-4 rounded-lg">
                {simpleMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
};
