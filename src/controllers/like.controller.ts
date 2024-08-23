import { type Request, type Response } from 'express';
import LikeService from '../services/utils/like.service';
import { LikeDTO } from '../dto/like.dto';
import { StatusCodes } from '../constant/StatusCodes';
import { Message } from '../constant/message';
const like = new LikeService();
export class LikeController {
  async changeLike(req: Request, res: Response) {
    try {
      const userId = req?.user?.id;
      const postId = req?.params?.postId;
      const likes = await like.changeLike(userId as string, postId);
      res.status(StatusCodes.SUCCESS).json({
        likes,
        Message: Message.success,
      });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
      console.log('🚀 ~ LikeController ~ like ~ error:', error);
    }
  }

  async likeCount(req: Request, res: Response) {
    const userId = req?.user?.id;
    const postId = req?.params?.postId;
    const likes = await like.getLikeCount(userId as string, postId);
    res.status(StatusCodes.SUCCESS).json({
      likes,
    });
  }
}
