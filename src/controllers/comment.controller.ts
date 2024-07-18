import { type Request, type Response } from 'express'
import { CommentDTO } from '../dto/comment.dto'
import CommentService from '../services/comment.service'
import { Message } from '../constant/message'
import { StatusCodes } from '../constant/StatusCodes'
export class CommentController {
  async comment(req: Request, res: Response) {
    const userId = req.user?.id
    const postId = req.params.id
    const details = await CommentService.comment(req.body as CommentDTO, userId as string, postId as string)
    res.status(StatusCodes.CREATED).json({
      Message: Message.created,
      details,
    })
  }

  async getComments(req: Request, res: Response) {
    const postId = req.params.id
    const comment = await CommentService.getComments(postId as string)
    res.status(StatusCodes.SUCCESS).json({
      comment,
    })
  }
}
