"use client";

import NavigationMenu from "./NavigationMenu";
import React, { useState } from "react";
import { Button } from "@nextui-org/react";

const HomePage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("chat message", (data) => {
  //       setMessages((prevMessages) => [...prevMessages, { message: data.msg, userId: data.userId }]);
  //     });
  //   }

  //   return () => {
  //     if (socket) {
  //       socket.off("chat message");
  //     }
  //   };
  // }, [socket]);

  // const handleSendMessage = (message) => {
  //   if (socket && message.trim() !== "") {
  //     socket.emit("chat message", `${message}`);
  //     setMessage("");
  //   }
  // };

  return (
    <div>
      <h1 className="text-4xl font-bold my-6 text-white">Wolvesville</h1>
      <p className="text-white">Welcome to my own version of Wolvesville!</p>
      <a target="_blank" className="text-white hover:text-blue-400" href="https://www.wolvesville.com">
        Check the original game here
      </a>
      <NavigationMenu />
      <hr />
      <div className="p-2">
        <div>
          {messages.map((data, index) => (
            <div className="text-white" key={index}>
              {data.message} send by {data.userId}
            </div>
          ))}
        </div>
        <input type="text" placeholder="Enter your message" onChange={(event) => setMessage(event.target.value)} />
        <br />
        <Button onClick={() => handleSendMessage(message)}>Send Message</Button>
      </div>
    </div>
  );
};

export default HomePage;
