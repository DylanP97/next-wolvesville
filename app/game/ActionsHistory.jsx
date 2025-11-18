// "use client";

// import { useGame } from "./GameProvider";
// import { useTranslation } from "react-i18next";
// import { replacePlaceholders } from "../lib/utils";
// import { useDevMode } from "../providers/DevModeProvider";
// import { useEffect, useState, useMemo, useRef } from "react";

// const ActionsHistory = () => {
//   const {
//     general,
//     wolves,
//     jail,
//     usedChat,
//     setUsedChat,
//     availableChats,
//   } = useGame();
//   const { isDevMode } = useDevMode();
//   const { t } = useTranslation();

//   const [messages, setMessages] = useState(usedChat.history);
//   const containerRef = useRef(null);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     if (containerRef.current) {
//       // Small delay to ensure DOM has updated
//       setTimeout(() => {
//         containerRef.current.scrollTop = containerRef.current.scrollHeight;
//       }, 0);
//     }
//   }, [messages]);

//   useEffect(() => {
//     switch (usedChat.type) {
//       case "general":
//         setMessages(general.history);
//         break;
//       case "wolves":
//         setMessages(wolves.history);
//         break;
//       case "jail":
//         setMessages(jail.history);
//         break;
//     }
//   }, [general, wolves, jail, usedChat.type]);

//   // Filter out DEV -- messages when dev mode is off
//   const filteredMessages = useMemo(() => {
//     if (isDevMode) {
//       return messages;
//     }
//     return messages.filter((msg) => {
//       const messageText = msg.msg || "";
//       return !messageText.includes("DEV --");
//     });
//   }, [messages, isDevMode]);

//   // Reverse so oldest is first (top), newest is last (bottom)
//   const displayMessages = useMemo(() => {
//     return [...filteredMessages].reverse();
//   }, [filteredMessages]);

//   const selectChat = (type) => {
//     switch (type) {
//       case "general":
//         setUsedChat(general);
//         break;
//       case "wolves":
//         setUsedChat(wolves);
//         break;
//       case "jail":
//         setUsedChat(jail);
//         break;
//       default:
//         setUsedChat(general);
//         break;
//     }
//   };

//   return (
//     <div className={`w-full z-10 relative overflow-hidden flex flex-col max-h-fit`}>
//       {/* header of the chat */}
//       <div className="h-12 flex justify-center">
//         {availableChats.map((chat, index) => {
//           return (
//             <div
//               className={`${
//                 chat.type === usedChat.type
//                   ? "bg-slate-400 border-red-500"
//                   : "bg-transparent"
//               } cursor-pointer px-4 flex items-center`}
//               key={"chattab-" + index}
//               onClick={() => selectChat(chat.type)}
//             >
//               <h2
//                 className={`${
//                   chat.type === usedChat.type ? "text-black" : "text-white "
//                 } text-sm`}
//               >
//                 {chat.label} {chat.emoji}
//               </h2>
//             </div>
//           );
//         })}
//       </div>

//       {/* content of the chat - ADD flex-col-reverse and justify-end */}
//       <div 
//         ref={containerRef}
//         className="bg-slate-400 z-10 p-2 overflow-y-auto flex-grow max-h-40 flex flex-col-reverse"
//       >
//         <div className="flex flex-col justify-end">
//           {displayMessages.length === 0 ? (
//             <div className="text-sm z-20 italic text-slate-600">
//               {usedChat.type === "general" && t("game.emptyGeneralChat")}
//               {usedChat.type === "wolves" && t("game.emptyWolvesChat")}
//               {usedChat.type === "jail" && t("game.emptyJailChat")}
//             </div>
//           ) : (
//             <div className="actions-list text-black text-sm space-y-1">
//               {displayMessages.map((msg, index) => {
//                 // Last message (at bottom) should be bold
//                 const isNewest = index === displayMessages.length - 1;
                
//                 if (msg.author) {
//                   return (
//                     <div
//                       key={index + "msg"}
//                       className={`text-sm z-20 ${isNewest && "font-bold"}`}
//                     >
//                       {msg.time} -- {msg.author}: {replacePlaceholders(msg.msg)}
//                     </div>
//                   );
//                 }
//                 return (
//                   <div
//                     className={`text-sm z-20 ${isNewest && "font-bold"}`}
//                     key={index + "msg"}
//                   >
//                     {msg.time} - {replacePlaceholders(msg.msg)}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ActionsHistory;