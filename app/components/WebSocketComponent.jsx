"use client";

import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Change the URL based on your server's address

const WebSocketComponent = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  socket.on("message", (data) => {
    console.log(data);
    setMessages((prevMessages) => [...prevMessages, data]);
  });

  const handleSendMessage = (message) => {
    // Send a message to the server
    console.log(message);
    socket.emit("message", { message });
    setMessage(""); // Clear the input field
  };

  return (
    <div>
      <div>
        <h2 className="text-white">Chat Room</h2>
        <div>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button color="secondary" onClick={() => handleSendMessage(message)}>
            Send
          </Button>
        </div>
        <div className="bg-white">
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.user}:</strong> {msg.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebSocketComponent;
