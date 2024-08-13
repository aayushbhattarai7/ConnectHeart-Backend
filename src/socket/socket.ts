import { Server } from "socket.io";
import HttpException from "../utils/HttpException.utils";
import webTokenService from "../utils/webToken.service";
import { DotenvConfig } from "../config/env.config";
import { RoomService } from "../services/utils/room.service";
import { ChatService } from "../services/utils/chat.service";
import userService from "../services/user.service";

const roomservice = new RoomService();

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
                        rooms.forEach((room) => {
                            if (room && room.id) {
                                socket.join(room.id);
                                console.log(`User ${userId} joined room ${room.id}`);
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error joining room:", error);
                }
            });

            socket.on("message", async ({ message, receiverId }) => {
                try {
                    if (!socket.data.user) {
                        throw new Error('User is not authenticated');
                    }
                    const chatService = new ChatService();

                    const userId = socket.data.user.id;
                    const rooms = await roomservice.checkRoom(userId, receiverId);
                    if (rooms) {
                        rooms.forEach(async (room) => {
                            if (room && room.id) {
                                const chat = await chatService.chat(userId, room.id, receiverId, { message });
                                const senders = await userService.getById(userId);
                                const receiver = await userService.getById(receiverId);
                                console.log("Chat saved:", chat);

                                const messagePayload = {
                                    id: socket.id,
                                    message,
                                    sender: {
                                        id: socket.data.user.id,
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
                                console.log(`Emitted message to room ${room.id}:`, messagePayload);
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error sending message:", error);
                }
            });

            socket.on("disconnect", () => {
                console.log("User Disconnected", socket.id);
            });
        });
    }
}