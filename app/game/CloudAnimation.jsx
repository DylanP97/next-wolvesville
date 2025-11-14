"use client";

import React, { useRef, useEffect, useState } from "react";
import { useGame } from "./GameProvider";

const CloudAnimation = ({ children }) => {

    const { timeOfTheDay } = useGame();

    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const directionRef = useRef([1, -1, 1]); // 1 for moving right, -1 for moving left for each cloud

    const [size, setSize] = useState({
        width: 0,
        height: 0
    });

    // Update size based on the component's container
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const updateSize = () => {
            if (containerRef.current) {
                setSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        // Call updateSize on mount and window resize
        window.addEventListener("resize", updateSize);
        updateSize(); // Initial size setup

        return () => {
            window.removeEventListener("resize", updateSize);
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (size.width === 0 || size.height === 0) return; // Wait until size is set

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = size.width;
        canvas.height = size.height;


        console.log("size.width", size.width);

        const background = new Image();
        background.src = "clouds/c1/1.png";

        const cloud4 = new Image();
        cloud4.src = "clouds/c1/4.png";

        const cloud2 = new Image();
        cloud2.src = "clouds/c1/2.png";

        const cloud3 = new Image();
        cloud3.src = "clouds/c1/3.png";

        const cloudState4 = {
            index: 0,
            x: -226, // Start position of the first cloud (left to right)
            y: -50,
            speed: 0.2,
            width: size.width * 1.10,
            height: size.height * 1.10
        };

        const cloudState2 = {
            index: 1,
            x: 0, // Start position of the second cloud (left edge of the canvas)
            y: 0,
            speed: 0.6,
            width: size.width * 1.10,
            height: size.height * 1.10
        };

        const cloudState3 = {
            index: 2,
            x: -1500, // Start position of the second cloud (left edge of the canvas)
            y: 0,
            speed: 2,
            width: size.width,
            height: size.height
        };

        let animationFrameId;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            const edgeToEdge = (image, imageState) => {
                imageState.x += imageState.speed * directionRef.current[imageState.index]
                if (directionRef.current[imageState.index] === 1 && imageState.x >= 0) {
                    directionRef.current[imageState.index] = -1;
                } else if (directionRef.current[imageState.index] === -1 && imageState.x <= canvas.width - imageState.width) {
                    directionRef.current[imageState.index] = 1;
                }

                ctx.drawImage(image, imageState.x, imageState.y, imageState.width, imageState.height);
            };

            edgeToEdge(cloud4, cloudState4);
            // edgeToEdge(cloud2, cloudState2);

            cloudState3.x += cloudState3.speed * directionRef.current[2];
            if (cloudState3.x === size.width) cloudState3.x = -1500;
            ctx.drawImage(cloud3, cloudState3.x, cloudState3.y, cloudState3.width, cloudState3.height);
            animationFrameId = requestAnimationFrame(animate);
        };

        // Ensure images are loaded before starting animation
        let loadedImages = 0;
        const checkAllImagesLoaded = () => {
            loadedImages++;
            if (loadedImages === 3) animate(); // Start animation when all three images are loaded
        };

        background.onload = checkAllImagesLoaded;
        cloud4.onload = checkAllImagesLoaded;
        cloud2.onload = checkAllImagesLoaded;

        // Handle window resizing
        const handleResize = () => {
            if (containerRef.current) {
                setSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [size]); // Re-run the effect when the size changes

    return (
        <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
            <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }}>
                {children}
            </canvas>
            {children}
        </div>
    );
};

export default CloudAnimation;
