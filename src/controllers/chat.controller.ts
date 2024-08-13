import { type Request, type Response } from "express";
import { ChatService } from "../services/utils/chat.service";
import { StatusCodes } from "../constant/StatusCodes";
import { ChatDTO } from "../dto/chat.dto";
import { RoomService } from "../services/utils/room.service";
const chat = new ChatService()
export class ChatController {
    async sendChat(req: Request, res: Response) {

        try {
            const senders = req.user?.id
            const receiverId = req.params.id
            const roomService = new RoomService()
            const rooms = await roomService.checkRoom(senders as string, receiverId)
            if(!rooms) throw new Error('Room not found')
            const body = req.body
        rooms.forEach((room)=> {
            const chats =  chat.chat(senders as string,receiverId, room.id, body as ChatDTO)
        })
            res.status(StatusCodes.SUCCESS).json({
                
            })
        } catch (error) {
            console.log(error)
        }

    }

    async displayChat(req:Request, res:Response){
        try {
            const userId = req.user?.id
            
            const receiverId = req.params.id
            const displaychat = await chat.displayChat(userId as string, receiverId)
            res.status(StatusCodes.SUCCESS).json({
                displaychat
            })
        } catch (error) {
            console.log("🚀 ~ ChatController ~ displayChat ~ error:", error)
            
        }
    }
}

/*  async chat(senders: string,  roomId:string, receiverId:string, data: ChatDTO) {
        try {
            console.log(senders, "ahdah")

            const auth = await this.AuthRepo.findOneBy({id:senders})
            console.log("🚀 ~ ChatService ~ chat ~ auth:", auth)
            
            if(!auth) throw HttpException.unauthorized

            const receiver = await this.AuthRepo.findOneBy({id:receiverId})
            console.log("🚀 ~ ChatService ~ chat ~ receiver:", receiver)
            if(!receiver) throw HttpException.notFound
           

            const room = await this.roomRepo.findOneBy({id:roomId})
            console.log("🚀 ~ ChatService ~ chat ~ room:", room)
            
            if(!room) throw HttpException.notFound('room not found')
            const chat = this.chatRepo.create({
                message: data.message,
                room:room,
                sender:auth,
                receiver:receiver
            })
            const saveChat = await this.chatRepo.save(chat)
            console.log("🚀 ~ ChatService ~ chat ~ saveChat:", saveChat)
            
            return saveChat
        } catch (error: any) {
            console.log(error?.message)
            throw new Error(error?.message)
        }
    } */