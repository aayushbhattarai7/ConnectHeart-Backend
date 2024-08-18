import { Chat } from "../../entities/chat/chat.entity";
import { AppDataSource } from "../../config/database.config";
import { Auth } from "../../entities/auth/auth.entity";
import HttpException from "../../utils/HttpException.utils";
import { ChatDTO } from "../../dto/chat.dto";
import { EncryptionService } from "../../utils/encrypt.utils";
import { Room } from "../../entities/chat/room.entity";

export class ChatService {
    constructor(
        private readonly chatRepo = AppDataSource.getRepository(Chat),
        private readonly AuthRepo = AppDataSource.getRepository(Auth),
        private readonly roomRepo = AppDataSource.getRepository(Room),
    ) { }

    async chat(senders: string, roomId: string, receiverId: string, data: ChatDTO) {
        try {
            const auth = await this.AuthRepo.findOneBy({ id: senders });
            if (!auth) throw HttpException.unauthorized;

            const receiver = await this.AuthRepo.findOneBy({ id: receiverId });
            if (!receiver) throw HttpException.notFound;

            const room = await this.roomRepo.findOneBy({ id: roomId });
            if (!room) throw HttpException.notFound('room not found');

            const encryptedMessage = EncryptionService.encryptMessage(data.message);

            const chat = this.chatRepo.create({
                message: encryptedMessage,
                room: room,
                sender: auth,
                receiver: receiver
            });
            const saveChat = await this.chatRepo.save(chat);
            const decryptedMessage = EncryptionService.decryptMessage(chat.message);
                    return { ...chat, message: decryptedMessage };

            } catch (error: any) {
                console.log(error?.message);
                throw new Error(error?.message);
        }
    }

    async displayChat(userId: string, receiverId: string) {
        try {
            const auth = await this.AuthRepo.findOneBy({ id: userId });
            if (!auth) throw  HttpException.unauthorized

            const chats = await this.chatRepo.find({
                where: [
                    { sender: { id: userId }, receiver: { id: receiverId } },
                    { sender: { id: receiverId }, receiver: { id: userId } }
                ],
                relations: ['sender', 'receiver', 'sender.details', 'receiver.details'],
                order: { createdAt: 'ASC' }
            });
            const decryptedChats = chats.map(chat => {
                try {
                    const decryptedMessage = EncryptionService.decryptMessage(chat.message);
                    return { ...chat, message: decryptedMessage };
                } catch (error) {
                    console.error(`Failed to decrypt message with ID ${chat.id}:`, error);
                    return chat; 
                }
            });
            console.log("ok")
            return decryptedChats;
        } catch (error) {
            console.log("🚀 ~ ChatService ~ displayChat ~ error:", error);
            throw error;
        }
    }

    async chatCount(userId:string, receiverId:string) {

        try {
            const auth = await this.AuthRepo.findOneBy({id:userId})
            if(!auth) throw HttpException.unauthorized

            const receiver = await this.AuthRepo.findOneBy({id:receiverId})
            if(!receiver) throw HttpException.notFound
    
            const chat = await this.chatRepo.find({
                where:  [
                    { sender: { id: receiverId }, receiver: { id: userId } }
                ]
                    })
    
            const chatCount:number = chat.length
            
            return chatCount
        } catch (error) {
            console.log("🚀 ~ ChatService ~ chatCount ~ error:", error)
            throw HttpException.badRequest
            
        }
      
    }

    async unreadChat(userId: string, senderId: string) {
        try {
            const auth = await this.AuthRepo.findOneBy({ id: userId });
            if (!auth) throw HttpException.unauthorized;
    
            const receiver = await this.AuthRepo.findOneBy({ id: senderId });
            if (!receiver) throw HttpException.notFound;
    
            const getUnreadChat = await this.chatRepo.find({
                where: [
                    { receiver: { id: userId }, sender: { id: senderId }, read: false },
                ],
                relations: ['receiver', 'sender'],
            });
    
            const getUnread = getUnreadChat.length;
            console.log(`Unread count for user ${userId} from sender ${senderId}:`, getUnread);
    
            return getUnread;
        } catch (error) {
            console.log("🚀 ~ ChatService ~ unreadChat ~ error:", error);
            throw HttpException.notFound;
        }
    }
    

    async readChat(userId:string, senderId:string) {
        console.log("🚀 ~ ChatService ~ readChat ~ senderId:", senderId)
        console.log("🚀 ~ ChatService ~ readChat ~ userId:", userId)
        
        const auth = await this.AuthRepo.findOneBy({id:userId})
            if(!auth) throw HttpException.unauthorized

            const sender = await this.AuthRepo.findOneBy({id:senderId})
            if(!sender) throw HttpException.notFound

            const readChat =   await this.chatRepo.update(
                {
                    sender: { id: senderId },
                    receiver: { id: userId },
                    read: false
                },
                { read: true }
            );
            console.log('clicked')
            return readChat
    }
}