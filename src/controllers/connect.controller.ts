import { type Request, type Response } from 'express'
import { Message } from '../constant/message'
import { StatusCodes } from '../constant/StatusCodes'
import { ConnectService } from '../services/connect.service'
const Connect = new ConnectService()
export class ConnectController {
  async connect(req: Request, res: Response) {
    try {
      const sender = req.user?.id
      console.log('🚀 ~ ConnectController ~ connect ~ sender:', sender)

      const receiver = req.params.id
      const send = await Connect.connect(sender as string, receiver)
      res.status(StatusCodes.SUCCESS).json({
        send,
        message: Message.success,
      })
    } catch (error) {
      console.log(error)
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      })
    }
  }

  async viewRequest(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      const viewRequest = await Connect.viewRequests(userId as string)
      res.status(StatusCodes.SUCCESS).json({
        viewRequest,
        message: Message.success,
      })
    } catch (error) {
      console.log('🚀 ~ ConnectController ~ viewRequest ~ error:', error)
      res.status(StatusCodes.NOT_FOUND).json({
        message: Message.error,
      })
    }
  }

  async accept(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const senderId = req.params.id
      const acceptRequest = await Connect.acceptRequest(userId as string, senderId)
      res.status(StatusCodes.SUCCESS).json({
        acceptRequest,
      })
    } catch (error) {
      console.log('🚀 ~ ConnectController ~ accept ~ error:', error)
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      })
    }
  }

  async reject(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const senderId = req.params.id
      const rejectRequest = await Connect.rejectRequest(userId as string, senderId)
      res.status(StatusCodes.SUCCESS).json({
        rejectRequest,
      })
    } catch (error) {
      console.log('🚀 ~ ConnectController ~ reject ~ error:', error)
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      })
    }
  }

  async friend(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const friends = await Connect.getFriends(userId as string)
      res.status(StatusCodes.SUCCESS).json({
        friends,
        message: Message.success,
      })
    } catch (error) {
      console.log('🚀 ~ ConnectController ~ friend ~ error:', error)
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      })
    }
  }
  async getUserSuggestion(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      console.log('🚀 ~ AuthController ~ getUserSuggestion ~ userId:', userId)

      const user = await Connect.getUserSuggestion(userId as string)
      res.status(StatusCodes.SUCCESS).json({
        message: Message.success,
        user,
      })
    } catch (error) {
      console.log('🚀 ~ AuthController ~ getUserSuggestion ~ error:', error)
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Error while getting suggestion',
      })
    }
  }

  async getCount(req: Request, res: Response) {
    const userId = req.user?.id
    const counts = await Connect.getFriendsCount(userId as string)
    res.status(StatusCodes.SUCCESS).json({
      message: Message.success,
      counts,
    })
  }

  async removeConnection(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const connectId = req.params.id
      const remove = await Connect.removeConnection(userId as string, connectId)
      res.status(StatusCodes.SUCCESS).json({
        message: Message.success,
        remove,
      })
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      })
    }
  }

  async chanageBlockStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const blocked = req.params.id
      const blockUser = await Connect.chanageBlockStatus(userId as string, blocked)
      res.status(StatusCodes.SUCCESS).json({
        blockUser,
        message: Message.success,
      })
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        Message: Message.error,
      })
    }
  }

  async getBlockedStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const blocked = req.params.id
      const blockeduser = await Connect.getBlockedStatus(userId as string, blocked)
      res.status(StatusCodes.SUCCESS).json({
        blockeduser,
      })
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        Message: Message.error,
      })
    }
  }
}
