"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import animationsData from "../lib/animations";
import { replacePlaceholders } from "../lib/utils";

const AnimationContext = createContext();

// Module-level cache for Lottie JSON data
const lottieCache = new Map();

export const AnimationProvider = ({ children }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [animationData, setAnimationData] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [simpleMessage, setSimpleMessage] = useState(null);
  const [animationText, setAnimationText] = useState(null);
  const [Lottie, setLottie] = useState(null);
  const videoRef = useRef(null);
  const animationQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    // Dynamically import Lottie only on client side
    import("react-lottie").then((module) => {
      setLottie(() => module.default);
    });

    // Pre-cache all Lottie animation JSON files in the background
    animationsData
      .filter((a) => a.type === "lottie")
      .forEach((a) => {
        if (!lottieCache.has(a.path)) {
          fetch(a.path)
            .then((res) => res.json())
            .then((json) => lottieCache.set(a.path, json))
            .catch(() => {});
        }
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

  const processNextAnimation = () => {
    // If already playing, don't process next one
    if (isPlayingRef.current) return;

    // If queue is empty, we're done
    if (animationQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    // Get next animation from queue (can be string or object with name and text)
    const queueItem = animationQueueRef.current.shift();
    const animationName = typeof queueItem === 'string' ? queueItem : queueItem.name;
    const animationText = typeof queueItem === 'object' ? queueItem.text : null;
    isPlayingRef.current = true;

    const animation = animationsData.find((a) => a.title === animationName);
    if (!animation) {
      // If animation not found, process next one
      isPlayingRef.current = false;
      processNextAnimation();
      return;
    }

    setCurrentAnimation(animation);
    setAnimationText(animationText);

    // Handle Lottie JSON animations
    if (animation.type === "lottie") {
      const playLottie = (animationJSON) => {
        setAnimationData(animationJSON);
        setShowAnimation(true);
        setFadeOut(false);

        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setShowAnimation(false);
            setCurrentAnimation(null);
            setAnimationData(null);
            setAnimationText(null);
            isPlayingRef.current = false;
            processNextAnimation();
          }, 500);
        }, animation.ms);
      };

      // Use cached data if available, otherwise fetch
      if (lottieCache.has(animation.path)) {
        playLottie(lottieCache.get(animation.path));
      } else {
        fetch(animation.path)
          .then((response) => {
            if (!response.ok) throw new Error(`Failed to load animation`);
            return response.json();
          })
          .then((animationJSON) => {
            lottieCache.set(animation.path, animationJSON);
            playLottie(animationJSON);
          })
          .catch((error) => {
            console.error("Failed to load animation:", error);
            isPlayingRef.current = false;
            processNextAnimation();
          });
      }
    }
    // Handle MP4 video animations
    else if (animation.type === "video") {
      setShowAnimation(true);
      setFadeOut(false);

      // Wait for video to load and play
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.error("Failed to play video:", error);
            isPlayingRef.current = false;
            processNextAnimation();
          });
        }
      }, 100);

      // Hide after duration
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setShowAnimation(false);
          setCurrentAnimation(null);
          setAnimationText(null);
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
          // Animation finished, process next one
          isPlayingRef.current = false;
          processNextAnimation();
        }, 500);
      }, animation.ms);
    }
  };

  const triggerAnimation = (animationName, text = null) => {
    // Add to queue (with text if provided)
    if (text) {
      animationQueueRef.current.push({ name: animationName, text });
    } else {
      animationQueueRef.current.push(animationName);
    }
    
    // Start processing if not already playing
    if (!isPlayingRef.current) {
      processNextAnimation();
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
              backgroundColor: "rgba(0, 0, 0, 0.12)",
              opacity: fadeOut ? 0 : 1,
              transition: "opacity 1.5s ease-out",
            }}
          >
            {/* Animation Container */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2rem",
                position: "relative",
              }}
            >
              {/* Lottie Animation */}
              {currentAnimation?.type === "lottie" && animationData && Lottie && (
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

              {/* Video Animation */}
              {currentAnimation?.type === "video" && (
                <video
                  ref={videoRef}
                  src={currentAnimation.path}
                  style={{
                    maxWidth: "80vw",
                    maxHeight: "60vh",
                    objectFit: "contain",
                    borderRadius: "12px",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
                  }}
                  muted
                  playsInline
                  preload="auto"
                />
              )}

              {/* Animation Text */}
              {animationText && (
                <div
                  className="animation-text-container z-30"
                  style={{
                    textAlign: "center",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    background: "rgba(91, 41, 137, 1)",
                    backdropFilter: "blur(10px)",
                    maxWidth: "90vw",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {replacePlaceholders(animationText)}
                  </p>
                </div>
              )}
            </div>

            {/* Simple Message (standalone, no animation) */}
            {simpleMessage && !currentAnimation && (
              <div
                className="simple-message-container"
                style={{
                    textAlign: "center",
                    padding: "1rem 2rem",
                    borderRadius: "12px",
                    background: "rgba(91, 41, 137, 1)",
                    backdropFilter: "blur(10px)",
                    maxWidth: "90vw",
                }}
              >
                <p
                  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "white",
                      margin: 0,
                  }}
                >
                  {simpleMessage}
                </p>
              </div>
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
