import { createContext, useContext, useState } from "react";
import Lottie from "react-lottie";
import animationsData from "../lib/animations";

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [animationData, setAnimationData] = useState(null);
  const [fadeOut, setFadeOut] = useState(false); // Unified fade state
  const [simpleMessage, setSimpleMessage] = useState(null);

  const triggerSimpleMessage = (text) => {
    setSimpleMessage(text);
    setShowAnimation(true);
    setFadeOut(false); // Ensure fade-in happens

    setTimeout(() => {
      setFadeOut(true); // Start fade-out
      setTimeout(() => {
        setSimpleMessage(null);
        setShowAnimation(false);
      }, 500); // Fade-out duration
    }, 2000); // Display duration before fading out
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
        setFadeOut(false); // Reset fade-out when starting new animation

        setTimeout(() => {
          setFadeOut(true); // Start fading out
          setTimeout(() => {
            setShowAnimation(false);
            setCurrentAnimation(null);
            setAnimationData(null);
          }, 500); // Fade-out duration
        }, animation.ms); // Start fade-out after animation duration
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
              position: "absolute",
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
              opacity: fadeOut ? 0 : 1, // Unified fade effect
              transition: "opacity 1.5s ease-out",
            }}
          >
            {currentAnimation && animationData && (
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
              <p className="text-3xl font-bold italic text-white bg-yellow-500 z-50 p-4 rounded-lg">
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
