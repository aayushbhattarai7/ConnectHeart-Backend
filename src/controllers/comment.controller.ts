import { type Request, type Response } from 'express'
import { CommentDTO } from '../dto/comment.dto'
import CommentService from '../services/comment.service'
import { Message } from '../constant/message'
import { StatusCodes } from '../constant/StatusCodes'
export class CommentController {
  async comment(req: Request, res: Response) {
    const userId = req.user?.id
    const postId = req.params.postId
    const details = await CommentService.comment(req.body as CommentDTO, userId as string, postId )
    res.status(StatusCodes.CREATED).json({
      Message: Message.created,
      details,
    })
  }

  async commentReply(req: Request, res: Response) {
    const userId = req.user?.id
    const postId = req.params.postId
    const commentId = req.params.commentId
    const details = await CommentService.commentReply(req.body as CommentDTO, userId as string, postId, commentId)
    res.status(StatusCodes.CREATED).json({
      Message: Message.created,
      details,
    })
  }
  async getComments(req: Request, res: Response) {
    const postId = req.params.postId
    const comment = await CommentService.getComments(postId as string)
    res.status(StatusCodes.SUCCESS).json({
      comment,
    })
  }

  async updateComment(req:Request, res:Response) {
    const userId = req.user?.id
    const commentId = req.params.id
    const commentUpdate = await CommentService.updateComments(userId as string, req.body as CommentDTO, commentId)
    res.status(StatusCodes.ACCEPTED).json({commentUpdate})
  }

  async deleteComment(req:Request, res:Response) {
    const userId = req.user?.id
    const commentId = req.params.commentId
    const deleteIt = await CommentService.deleteComments(userId as string, commentId)
    res.status(StatusCodes.ACCEPTED).json({deleteIt})

  }
}
