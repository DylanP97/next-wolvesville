import { createContext, useContext, useState, useEffect } from "react";
import Lottie from "react-lottie";
import animationsData from "../lib/animations";

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [animationData, setAnimationData] = useState(null);
  const [fadeOut, setFadeOut] = useState(false); // Track fade-out

  const triggerAnimation = async (animationName) => {
    const animation = animationsData.find((a) => a.title === animationName);
    if (animation) {
      setCurrentAnimation(animation);

      try {
        const response = await fetch(animation.path);
        if (!response.ok) throw new Error(`Failed to load animation: ${response.statusText}`);

        const animationJSON = await response.json();
        setAnimationData(animationJSON);

        setShowAnimation(true);
        setFadeOut(false); // Reset fade-out when starting a new animation

        setTimeout(() => {
          setFadeOut(true); // Start fading out
          setTimeout(() => {
            setShowAnimation(false); // Hide after fade-out completes
            setCurrentAnimation(null);
            setAnimationData(null); // Reset
          }, 1000); // Fade out duration (1 second)
        }, animation.ms); // Start fade-out after animation duration
      } catch (error) {
        console.error("Failed to load animation:", error);
      }
    }
  };

  return (
    <AnimationContext.Provider value={{ triggerAnimation }}>
      <div>
        {children}
        {showAnimation && currentAnimation && animationData && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              opacity: fadeOut ? 0 : 1, // Apply fade-out effect
              transition: "opacity 1s ease-out", // Smooth transition
            }}
          >
            <Lottie
              options={{
                loop: false,
                autoplay: true,
                animationData: animationData, 
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
              height={400}
              width={400}
            />
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
