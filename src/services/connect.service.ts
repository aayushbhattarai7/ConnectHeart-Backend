import { AppDataSource } from "../config/database.config";
import { Auth } from "../entities/auth/auth.entity";
import { Connect } from "../entities/connection/connection.entity";
import HttpException from "../utils/HttpException.utils";

export class ConnectService {
    constructor(
        private readonly connectRepo = AppDataSource.getRepository(Connect),
        private readonly AuthRepo = AppDataSource.getRepository(Auth)
    ){}

    async connect(sender:string, receiver:string):Promise<Connect>{
        try {
            const senderId = await this.AuthRepo.findOneBy({id:sender})
            if(!senderId) throw HttpException.unauthorized

            const receiverId = await this.AuthRepo.findOneBy({id:receiver})
            if(!receiverId) throw HttpException.notFound("Receiver Not Found")
            if(sender === receiver) throw HttpException.badRequest('Cannot send friend request')
                const existRequest = await this.connectRepo.findOne({ where:[
                {sender:senderId, receiver:receiverId},
                {sender:receiverId, receiver:senderId}]})

                if(existRequest) {
                    throw new Error('Friend Request already sent to this user')
                }

            const send = this.connectRepo.create({
                sender:senderId,
                receiver:receiverId,
            })
            await this.connectRepo.save(send)
            return send

        } catch (error) {
            console.log(error,"error")
           throw HttpException.badRequest
        }
    }
}