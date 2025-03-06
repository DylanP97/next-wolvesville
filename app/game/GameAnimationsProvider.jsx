// "use client";

// import { createContext, useContext, useState } from "react";

// const GameAnimationsContext = createContext();

// export const GameAnimationsProvider = ({ children }) => {


//   // const triggerAnimation = (animation) => {
//   //   console.log("animation", animation);
//   // };

//   const triggerSimpleMessage = (text) => {
//     setSimpleMessage(text);
//     setIsFading(true); // Start fade-in animation
//     setTimeout(() => {
//       setIsFading(false); // Start fade-out animation
//       setTimeout(() => {
//         setSimpleMessage(null); // Remove error message after fade-out
//       }, 500); // Match this timeout to the duration of fade-out animation
//     }, 1500); // Display the message for 1.5 seconds
//   };

//   return (
//     <GameAnimationsContext.Provider
//       value={{ triggerAnimation, triggerSimpleMessage }}
//     >
//       {children}
//       {simpleMessage && (
//         <div className="flex justify-center items-center z-50 absolute inset-0">
//           <p
//             className={`text-3xl font-bold italic text-white bg-yellow-500 z-50 ${isFading ? "fade-in" : "fade-out"
//               }`}
//           >
//             {simpleMessage}
//           </p>
//         </div>
//       )}
//     </GameAnimationsContext.Provider>
//   );
// };

// export const useGameAnimations = () => {
//   const context = useContext(GameAnimationsContext);
//   if (!context) {
//     throw new Error("useGame must be used within an GameProvider");
//   }
//   return context;
// };
