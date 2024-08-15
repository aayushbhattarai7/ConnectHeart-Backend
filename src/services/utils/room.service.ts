import { Room } from "../../entities/chat/room.entity";
import { AppDataSource } from "../../config/database.config";
import HttpException from "../../utils/HttpException.utils";
import { Auth } from "../../entities/auth/auth.entity";

export class RoomService {
    constructor(
        private readonly roomrepo = AppDataSource.getRepository(Room),
        private readonly authrepo = AppDataSource.getRepository(Auth)

    ){}
    async checkRoom(userId: string, receiverId: string) {
        try {

            
            const user = await this.authrepo.findOneBy({id:userId})
            if(!user) throw HttpException.notFound

            const receiver = await this.authrepo.findOneBy({id:receiverId})
            if(!receiver) throw HttpException.notFound


            const findRoom = await this.roomrepo.find({
                where: [
                    { sender: { id: userId }, receiver: { id: receiverId } },
                    { sender: { id: receiverId }, receiver: { id: userId } }
                ]
            });
            if (!findRoom || findRoom.length === 0) {
                console.log("Room not found, returning null");
                return null;
            }
            return findRoom;
        } catch (error) {
            console.log("🚀 ~ RoomService ~ checkRoom ~ error:", error);
            return null
        }
    }
}