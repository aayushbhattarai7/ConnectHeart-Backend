import { type Request, type Response } from 'express';
import { CommentDTO } from '../dto/comment.dto';
import CommentService from '../services/comment.service';
import { Message } from '../constant/message';
import { StatusCodes } from '../constant/StatusCodes';
import commentService from '../services/comment.service';
export class CommentController {
  async comment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const postId = req.params.postId;
      console.log(req.body, 'hahahxyz');
      const details = await CommentService.comment(
        req.body as CommentDTO,
        userId as string,
        postId,
      );
      res.status(StatusCodes.CREATED).json({
        Message: Message.created,
        details,
      });
    } catch (error) {
      console.log('🚀 ~ CommentController ~ comment ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }

  async commentReply(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const postId = req.params.postId;
      const commentId = req.params.commentId;
      const details = await CommentService.commentReply(
        req.body as CommentDTO,
        userId as string,
        postId,
        commentId,
      );
      res.status(StatusCodes.CREATED).json({
        Message: Message.created,
        details,
      });
    } catch (error) {
      console.log('🚀 ~ CommentController ~ commentReply ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }
  async getComments(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const comment = await CommentService.getComments(postId as string);
      res.status(StatusCodes.SUCCESS).json({
        comment,
      });
    } catch (error) {
      console.log('🚀 ~ CommentController ~ getComments ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }

  async updateComment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const commentId = req.params.id;
      const commentUpdate = await CommentService.updateComments(
        userId as string,
        req.body as CommentDTO,
        commentId,
      );
      res.status(StatusCodes.ACCEPTED).json({ commentUpdate });
    } catch (error) {
      console.log('🚀 ~ CommentController ~ updateComment ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }

  async deleteComment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const commentId = req.params.commentId;
      const deleteIt = await CommentService.deleteComments(
        userId as string,
        commentId,
      );
      res.status(StatusCodes.ACCEPTED).json({ deleteIt });
    } catch (error) {
      console.log('🚀 ~ CommentController ~ deleteComment ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }

  async getAllComment(req: Request, res: Response) {
    try {
      const comments = await CommentService.getPostComment();
      res.status(StatusCodes.ACCEPTED).json({ comments });
    } catch (error) {
      console.log('🚀 ~ CommentController ~ comments ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }
}
