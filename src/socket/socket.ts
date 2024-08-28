import { Server } from 'socket.io';
import HttpException from '../utils/HttpException.utils';
import webTokenService from '../utils/webToken.service';
import { DotenvConfig } from '../config/env.config';
import { RoomService } from '../services/utils/room.service';
import { ChatService } from '../services/utils/chat.service';
import userService from '../services/user.service';

const roomService = new RoomService();
const chatService = new ChatService();

export class Socket {
  async ChatSocket(server: any) {
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('You are not authorized'));

      try {
        const user = webTokenService.verify(
          token,
          DotenvConfig.ACCESS_TOKEN_SECRET,
        );
        if (user) {
          socket.data.user = user;
          next();
        } else {
          next(new Error('You are not authorized'));
        }
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });

    io.on('connection', socket => {
      socket.join(socket.data.user.id)

      socket.on('room', async ({ receiverId }) => {
        const userId = socket.data.user.id;
        
        try {
          const rooms = await roomService.checkRoom(userId, receiverId);
          if (rooms) {
            rooms?.forEach(room => {
              if (room && room?.id) {
                socket.join(room.id);
              }
            });
          } else {
            console.log('Room not found');
          }
        } catch (error) {
          console.error('Error joining room:', error);
        }
      });

      socket.on('message', async ({ message, receiverId }) => {
        try {
          if (!socket.data.user) {
            throw new Error('User is not authenticated');
          }

          const userId = socket.data.user.id;
          const rooms = await roomService.checkRoom(userId, receiverId);
          if (rooms) {
            const roomId = rooms?.find(room => room?.id)?.id;
            if (roomId) {
              const chat = await chatService.chat(userId, roomId, receiverId, {
                message,
              });
              const senders = await userService.getById(userId);
              const receiver = await userService.getById(receiverId);

              rooms.forEach(async room => {
                const messagePayload = {
                  id: socket.data.user.id,
                  message: chat.message,
                  sender: {
                    id: senders.id,
                    details: {
                      first_name: senders.details.first_name,
                      last_name: senders.details.last_name,
                    },
                  },
                  receiver: {
                    id: receiverId,
                    first_name: receiver.details.first_name,
                    last_name: receiver.details.last_name,
                  },
                };



                io.to(room.id).emit('message', messagePayload);
              try {
                const unreadCount = await chatService.unreadChat(receiverId, senders.id)
                io.to(receiverId).emit('unreadCounts', {
                  senderId: senders.id,
                  unreadCount: unreadCount
                })
              } catch (error) {
              console.log(error)
              }

              });
            }
          } else {
            console.log('Room not found');
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
      });


      socket.on('readed', async ({ senderId }) => {
        try {
          const userId = socket.data.user.id
          await chatService.readChat(userId, senderId)
        const unreadCount = await chatService.unreadChat(userId, senderId)

          io.to(userId).emit('read',{senderId, unreadCount})
                
        } catch (error) {
          console.log(error)
        }
      })


      socket.on('typing', async ({ receiverId }) => {
        const userId = socket.data.user.id;
        const findRoom = await roomService.checkRoom(userId, receiverId);
        if (findRoom) {
          const roomId = findRoom?.find(room => room?.id)?.id;
          if (!roomId) return null;
          io.to(roomId).emit('typing', { userId });
        }
      });

      socket.on('notify', ({ receiverId }) => {});

      socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
      });
    });
  }
}
