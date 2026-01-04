import React, { useEffect, useRef } from 'react';

const CardAnimationOverlay = ({ path }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.currentTime = 0; // reset to start
        await video.play();
      } catch (error) {
        console.error("Failed to play card animation:", error);
      }
    };

    playVideo();

    // Cleanup
    return () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, [path]); // Re-run when path changes

  if (!path) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-lg">
      <video
        ref={videoRef}
        src={path}
        style={{
          width: '100%',
          height: '100%',
          objectFit: "cover", // or "contain" depending on desired effect
          filter: 'grayscale(0) blur(0px)'
        }}
        muted
        playsInline
        preload="auto"
        loop={false}
      />
    </div>
  );
};

export default CardAnimationOverlay;