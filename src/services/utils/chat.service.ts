import { Chat } from "../../entities/chat/chat.entity";
import { AppDataSource } from "../../config/database.config";
import { Auth } from "../../entities/auth/auth.entity";
import HttpException from "../../utils/HttpException.utils";
import { ChatDTO } from "../../dto/chat.dto";
import BcryptService from "../../utils/bcrypt.utils";
import { EncryptionService } from "../../utils/encrypt.utils";
import { Room } from "../../entities/chat/room.entity";

export class ChatService {
    constructor(
        private readonly chatRepo = AppDataSource.getRepository(Chat),
        private readonly AuthRepo = AppDataSource.getRepository(Auth),
        private readonly encryptService = new EncryptionService(),
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

            return saveChat;
        } catch (error: any) {
            console.log(error?.message);
            throw new Error(error?.message);
        }
    }

    async displayChat(userId: string, receiverId: string) {
        try {
            const auth = await this.AuthRepo.findOneBy({ id: userId });
            if (!auth) throw new HttpException('Unauthorized', 401);

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
            return decryptedChats;
        } catch (error) {
            console.log("🚀 ~ ChatService ~ displayChat ~ error:", error);
            throw error;
        }
    }
}