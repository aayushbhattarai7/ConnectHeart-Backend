import { type Request, type Response } from 'express';
import { Message } from '../constant/message';
import { StatusCodes } from '../constant/StatusCodes';
import PostService from '../services/post.service';
import { PostDTO } from '../dto/post.dto';
export class PostController {
  async create(req: Request, res: Response) {
    try {
      const userId = req?.user?.id;
      console.log(req?.files, 'aayushhh');
      const data = req.files?.map((file: any) => {
        return {
          name: file?.filename,
          mimetype: file?.mimetype,
          type: req.body?.type,
        };
      });
      await PostService.createPost(
        data as any,
        req.body as PostDTO,
        userId as string,
      );
      res.status(StatusCodes.CREATED).json({
        status: true,
        data,
        message: Message.created,
      });
    } catch (error: any) {
      console.log('🚀 ~ PostController ~ create ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error?.message,
      });
    }
  }
  async update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const postId = req.params.id;
      const data = req?.files?.map((file?: any) => {
        return {
          name: file?.filename,
          mimetype: file?.mimetype,
          type: req.body?.type,
        };
      });
      await PostService.updatePost(
        data as any,
        req.body as PostDTO,
        userId as string,
        postId as string,
      );
      res.status(StatusCodes.SUCCESS).json(Message.updated);
    } catch (error) {
      console.log('🚀 ~ PostController ~ update ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }

  async getPost(req: Request, res: Response) {
    try {
      const postId = req.params.postId;
      const posts = await PostService.getPost(postId as string);
      res.status(StatusCodes.SUCCESS).json({
        posts,
      });
    } catch (error) {
      console.log('🚀 ~ PostController ~ getPost ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }

  async getAllPost(req: Request, res: Response) {
    try {
      const posts = await PostService.getAllPost();
      res.status(StatusCodes.SUCCESS).json({
        posts,
      });
    } catch (error) {
      console.log('🚀 ~ PostController ~ getAllPost ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Error While fetching post',
      });
    }
  }

  async getUserPost(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const displayPost = await PostService.getUserPost(userId as string);
      res.status(StatusCodes.SUCCESS).json({
        message: Message.success,
        displayPost,
      });
    } catch (error) {
      console.log('🚀 ~ PostController ~ getUserPost ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const postId = req.params.postId;
      await PostService.delete(userId as string, postId);
      res.status(StatusCodes.SUCCESS).json(Message.deleted);
    } catch (error) {
      console.log('🚀 ~ PostController ~ delete ~ error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      });
    }
  }
}
