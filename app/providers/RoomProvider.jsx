// // RoomContext.js
// import { createContext, useContext, useState } from 'react';

// const RoomContext = createContext();

// export const RoomProvider = ({ children }) => {
//   const [rooms, setRooms] = useState([]);



//   return (
//     <RoomContext.Provider value={{ rooms, addRoom }}>
//       {children}
//     </RoomContext.Provider>
//   );
// };

// export const useRoomContext = () => {
//   return useContext(RoomContext);
// };
