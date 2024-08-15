import { Server } from "socket.io";
import HttpException from "../utils/HttpException.utils";
import webTokenService from "../utils/webToken.service";
import { DotenvConfig } from "../config/env.config";
import { RoomService } from "../services/utils/room.service";
import { ChatService } from "../services/utils/chat.service";
import userService from "../services/user.service";

const roomservice = new RoomService();
const chatService = new ChatService();

export class Socket {
    async ChatSocket(server: any) {
        const io = new Server(server, {
            cors: {
                origin: '*'
            }
        });

        io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error('You are not authorized'));

            try {
                const user = webTokenService.verify(token, DotenvConfig.ACCESS_TOKEN_SECRET);
                if (user) {
                    socket.data.user = user;
                    next();
                } else {
                    next(new Error('You are not authorized'));
                }
            } catch (error) {
                console.log("🚀 ~ Socket ~ io.use ~ error:", error);
                next(new Error('Invalid token'));
            }
        });

        io.on("connection", (socket) => {
            socket.join(socket.data.user.id);

            socket.on("room", async ({ receiverId }) => {
                const userId = socket.data.user.id;
                try {
                    const rooms = await roomservice.checkRoom(userId, receiverId);
                    if (rooms) {
                        rooms?.forEach((room) => {
                            if (room && room?.id) {
                                socket.join(room.id);
                                console.log(`User ${userId} joined room ${room.id}`);
                            }
                        });
                    }else{
                        console.log("room not found")
                        throw new Error("room not found")
                    }
                } catch (error) {
                    console.error("Error joining room:", error);
                }
            });

            socket.on("message", async({ message, receiverId }) => {
                try {
                    if (!socket.data.user) {
                        throw new Error('User is not authenticated');
                    }

                    const userId = socket.data.user.id;
                    const rooms = await roomservice.checkRoom(userId, receiverId);
                    if (rooms) {
                        const roomId = rooms?.find((room) => room?.id)?.id
                        if(roomId){
                            const chat = await chatService.chat(userId, roomId, receiverId, { message });
                            const senders = await userService.getById(userId);
                            const receiver = await userService.getById(receiverId);
                        

                        rooms.forEach( (room) => {
                                const messagePayload = {
                                    id: socket.data.user.id,
                                    message:chat.message,
                                    sender: {
                                        id: senders.id,
                                        details: {
                                            first_name: senders.details.first_name,
                                            last_name: senders.details.last_name,
                                        }
                                    },
                                    receiver: {
                                        id: receiverId,
                                        first_name: receiver.details.first_name,
                                        last_name: receiver.details.last_name,
                                    }
                                };

                                io.to(room.id).emit('message', messagePayload);
            
                        });
                    }
                    }
                } catch (error) {
                    console.error("Error sending message:", error);
                }
            });

            socket.on("readed", async({senderId})=> {
                console.log("🚀 ~ Socket ~ socket.on ~ senderId:", senderId)
                try {
                    if(!socket.data.user.id) throw HttpException.unauthorized
                    const userId = socket.data.user.id
                    
                    const chat = await chatService.readChat(userId, senderId)
                    io.to(socket.id).emit('read',{ read:true})
                } catch (error) {
                    console.log("🚀 ~ Socket ~ socket.on ~ error:", error)   
                }
            })

            socket.on("disconnect", () => {
                console.log("User Disconnected", socket.id);
            });
        });
    }
}