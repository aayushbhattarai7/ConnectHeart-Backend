import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Settings = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const socket = io('http://localhost:4000');

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to Socket.IO server");
        });

        socket.on("message", (message: string) => {
            console.log("Received message:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on("connect_error", (err) => {
            console.error("Connection error:", err);
        });

        return () => {
            socket.off("message");
            socket.off("connect_error");
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        socket.emit("message", "Hello from client");
    };

    return (
        <div>
            <button onClick={sendMessage}>Send Message</button>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
        </div>
    );
};

export default Settings;
