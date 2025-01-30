"use client";

import { FormEvent, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

interface Message {
  userId?: string;
  receiverId?: string;
  message?: string;
  createdAt?: string;
}

const defaultMessage = {
  userId: "",
  message: "",
  receiverId: "",
  createdAt: "",
};

export const ChatApp = () => {
  const [message, setMessage] = useState<Message[]>([]);
  const [tempMessage, setTempMessage] = useState<Message>(defaultMessage);
  console.log("error")

  useEffect(() => {
    socket.on("message_error", (msg) => {
      console.log(msg);
    });

    socket.on("message_receive", (data) => {
      const {message, status} = data;
      if(status === "sent"){
        console.log(data);
        setMessage((prev) => [...prev, {message}]);
      }else if(status === "delivered"){
        console.log(data);
        setMessage((prev) => [...prev, {message}]);
      }
    });

    return () => {
      socket.emit("disconnect");
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempMessage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !tempMessage.message ||
        !tempMessage.userId ||
        !tempMessage.receiverId
    ) {
      return;
    } else {
      socket.emit("message_send", {
        senderId: tempMessage.userId,
        receiverId: tempMessage.receiverId,
        message: tempMessage.message,
      });
      console.log("message send");
      setMessage((prev) => [...prev, tempMessage]);
    }
  };

  const handleLoggedIn = () => {
    if (!tempMessage.userId) {
      console.log("Please type something in userId");
    } else {
      socket.emit("message_login", { userId: tempMessage.userId });
      socket.on("isLogin", (msg) => {
        console.log(msg);
      });
    }
  };


  return (
    <>
      <div>
        <div className="flex flex-col h-screen">
          <ul className="flex-grow overflow-y-auto list-none p-4">
            {message.map((msg, index) => (
              <li
                key={index}
                className={`p-2 rounded mb-2 ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-300"}`}
              >
                {msg.message}
              </li>
            ))}
          </ul>
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-gray-200 p-2"
          >
            <input
              type="text"
              value={tempMessage.message}
              name="message"
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-full focus:outline-none focus:ring focus:ring-blue-300"
            />

            <input
              type="text"
              name="userId"
              value={tempMessage.userId}
              onChange={handleInputChange}
              placeholder="Type your id..."
              className="flex-grow p-2 border rounded-full focus:outline-none focus:ring focus:ring-blue-300"
            />

            <input
              type="text"
              name="receiverId"
              value={tempMessage.receiverId}
              onChange={handleInputChange}
              placeholder="Type receiver id..."
              className="flex-grow p-2 border rounded-full focus:outline-none focus:ring focus:ring-blue-300"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-full ml-2 hover:bg-blue-600"
            >
              Send
            </button>

            <button
              onClick={handleLoggedIn}
              className="bg-blue-500 text-white px-4 py-2 rounded-full ml-2 hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
