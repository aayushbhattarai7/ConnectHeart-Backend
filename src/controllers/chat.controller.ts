import { type Request, type Response } from 'express'
import { ChatService } from '../services/utils/chat.service'
import { StatusCodes } from '../constant/StatusCodes'
import { ChatDTO } from '../dto/chat.dto'
import { RoomService } from '../services/utils/room.service'
import { Message } from '../constant/message'
const chat = new ChatService()
export class ChatController {
  async sendChat(req: Request, res: Response) {
    // try {
    //     const senders = req.user?.id
    //     const receiverId = req.params.id
    //     const roomService = new RoomService()
    //     const rooms = await roomService.checkRoom(senders as string, receiverId)
    //     if(!rooms) throw new Error('Room not found')
    //     const body = req.body
    // rooms.forEach((room)=> {
    //     const chats =  chat.chat(senders as string,receiverId, room.id, body as ChatDTO)
    // })
    //     res.status(StatusCodes.SUCCESS).json({
    //     })
    // } catch (error) {
    //     console.log(error)
    // }
  }

  async displayChat(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      const receiverId = req.params.id
      const displaychat = await chat.displayChat(userId as string, receiverId)
      res.status(StatusCodes.SUCCESS).json({
        displaychat,
      })
    } catch (error) {
      console.log('🚀 ~ ChatController ~ displayChat ~ error:', error)
    }
  }

  async chatCount(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const receiverId = req.params.id
      const getCount = await chat.chatCount(userId as string, receiverId)
      res.status(StatusCodes.SUCCESS).json({
        getCount,
        message: Message.success,
      })
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      })
    }
  }

  async getUndreadChat(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const senderId = req.params.id
      const unreadchat = await chat.unreadChat(userId as string, senderId)
      res.status(StatusCodes.SUCCESS).json({
        message: Message.success,
        unreadchat,
      })
    } catch (error) {
      console.log('🚀 ~ ChatController ~ getUndreadChat ~ error:', error)
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      })
    }
  }

  async readChat(req: Request, res: Response) {
    //     try {
    //         const userId = req.user?.id
    //         const senderId = req.params.id
    //         const read = await chat.readChat(userId as string, senderId)
    //         res.status(StatusCodes.SUCCESS).json({
    //             message:Message.success,
    //             read
    //         })
    //     } catch (error) {
    //         console.log("🚀 ~ ChatController ~ getUndreadChat ~ error:", error)
    //         res.status(StatusCodes.BAD_REQUEST).json({
    //             message:Message.error
    //         })
    //     }
  }
}
