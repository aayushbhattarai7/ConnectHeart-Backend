import { useEffect, useState } from "react";
import axiosInstance from "../../../service/instance";
import { useParams } from "react-router-dom";
import {jwtDecode} from "jwt-decode";  
import { useForm } from "react-hook-form";
import { io, Socket as IOSocket } from 'socket.io-client';

interface DecodedToken {
    id: string;
    email: string;
}

interface FormData {
    message: string;
}

interface Messages {
    id: string;
    message: string;
    receiver: {
        id: string;
        details: {
            first_name: string;
            last_name: string;
        };
    };
    sender: {
        id: string;
        details: {
            first_name: string;
            last_name: string;
        };
    };
}

const Message = () => {
    const { userId } = useParams<{ userId: string }>();
    const [chats, setChats] = useState<Messages[]>([]);
    const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>();
    const [socket, setSocket] = useState<IOSocket | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setDecodedToken(decoded);
                fetchChat(userId!);
            } catch (error) {
                console.error("Failed to decode token", error);
            }
        } else {
            console.error("No token found in sessionStorage");
        }
    }, [userId]);

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        const newSocket = io('http://localhost:4000', {
            auth: {
                token: token
            }
        });
    
        setSocket(newSocket);
    
        newSocket.on("connect", () => {
            console.log("Connected to Socket.IO server");
        });
    
        newSocket.on("message", (message: Messages) => {
            console.log("Received message:", message);
            setChats((prevChats) => [...prevChats, message]);
        });
    
        newSocket.on("connect_error", (err) => {
            console.error("Connection error:", err);
        });
    
        return () => {
            newSocket.off("message");
            newSocket.off("connect_error");
            newSocket.disconnect();
        };
    }, []);
    

    const fetchChat = async (id: string) => {
        try {
            const response = await axiosInstance.get(`/chat/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setChats(response.data.displaychat);
        } catch (error) {
            console.error("Error fetching chat data", error);
        }
    };

    const onSubmit = async (data: FormData) => {
        if (!decodedToken?.id) {
            console.error("User not authenticated");
            return;
        }

        socket?.emit("message", {
            message: data.message,
            receiverId: userId,
        });

        try {
            const res = await axiosInstance.post(`/chat/${userId}`, { message: data.message }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Message sent:", res.data);
            reset();
        } catch (error) {
            console.log("Error sending message:", error);
        }
    };

    return (
        <div className="h-screen border overflow-y-auto">
            <div className="flex flex-col-reverse p-4 w-[maxx] justify-start items-start mt-24 ml-96">
                <div className="flex flex-col justify-end w-full items-center overflow-y-auto">
                {chats.map((chat, index) => (
    <div
        key={`${chat.id}-${index}`}  
        className={`mb-2 p-4 rounded-lg shadow-md flex ${decodedToken?.id === chat.sender.id
            ? "bg-blue-500 text-white justify-end items-end self-end ml-auto"
            : "bg-gray-300 text-black justify-start items-end self-start mr-auto"
            }`}>
        <div className="flex flex-col max-w-80">
            <p className="font-semibold">{chat.sender.details.first_name}</p>
            <p>{chat.message}</p>
        </div>
    </div>
))}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full mt-4">
                        <input
                            type="text"
                            {...register("message")}  
                            placeholder="Type your message..." 
                            className="flex-grow p-2 border border-gray-300 rounded-l-lg" 
                            required 
                        />
                        <button
                            type="submit" 
                            disabled={isSubmitting} 
                            className="bg-blue-500 text-white p-2 rounded-r-lg"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Message;
