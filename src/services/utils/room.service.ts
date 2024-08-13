import { Room } from "../../entities/chat/room.entity";
import { AppDataSource } from "../../config/database.config";

export class RoomService {
    constructor(
        private readonly roomrepo = AppDataSource.getRepository(Room)
    ){}
    async checkRoom(userId: string, receiverId: string) {
        try {
            const findRoom = await this.roomrepo.find({
                where: [
                    { sender: { id: userId }, receiver: { id: receiverId } },
                    { sender: { id: receiverId }, receiver: { id: userId } }
                ]
            });
        
            return findRoom;
        } catch (error) {
            console.log("🚀 ~ RoomService ~ checkRoom ~ error:", error);
            throw new Error('Error checking room');
        }
    }
}