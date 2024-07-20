import { type Request, type Response } from 'express'
import { Message } from '../constant/message'
import { StatusCodes } from '../constant/StatusCodes'
import PostService from '../services/post.service'
import { PostDTO } from '../dto/post.dto'
import HttpException from '../utils/HttpException.utils'
export class PostController {
  async create(req: Request, res: Response) {
    const userId = req?.user?.id
    console.log(userId)
    if (req?.files?.length === 0) throw HttpException.badRequest
    console.log(req?.files)
    const data = req?.files?.map((file: any) => {
      return {
        name: file?.filename,
        mimetype: file?.mimetype,
        type: req.body?.type,
      }
    })
    console.log(req.body)
    await PostService.createPost(data as any, req.body as PostDTO, userId as string)
    res.status(StatusCodes.CREATED).json({
      status: true,
      data,
      message: Message.created,
    })
  }
  async update(req: Request, res: Response) {
    const userId = req.user?.id
    const postId = req.params.id
    const data = req?.files?.map((file: any) => {
      return {
        name: file?.filename,
        mimetype: file?.mimetype,
        type: req.body?.type,
      }
    })
    await PostService.update(data as any, req.body as PostDTO, userId as string, postId as string)
    res.status(StatusCodes.SUCCESS).json(Message.updated)
  }

  async updateImage(req: Request, res: Response) {
    const userId = req.user?.id
    const postId = req.params.id
    const imageId = req.params.imageId
    const data = req?.files?.map((file: any) => {
      return {
        name: file?.filename,
        mimetype: file?.mimetype,
        type: req.body?.type,
      }
    })
    await PostService.updateImage(data as any, userId as string, postId as string, imageId as string)
    res.status(StatusCodes.SUCCESS).json(Message.updated)
  }

  async getPost(req: Request, res: Response) {
    try {
      const postId = req.params.postId
      const posts = await PostService.getPost(postId as string)
      res.status(StatusCodes.SUCCESS).json({
        posts,
      })
    } catch (error) {
      console.log('🚀 ~ PostController ~ getPost ~ error:', error)
      res.status(StatusCodes.BAD_REQUEST).json({
        message: Message.error,
      })
    }
  }
  async getUserPost(req: Request, res: Response) {
    const userId = req.user?.id
    const displayPost = await PostService.getUserPost(userId as string)
    res.status(StatusCodes.SUCCESS).json({
      message: Message.success,
      displayPost,
    })
  }

  async delete(req: Request, res: Response) {
    const userId = req.user?.id
    const postId = req.params.postId
    console.log(postId, 'posttttt')
    await PostService.delete(userId as string, postId)
    res.status(StatusCodes.SUCCESS).json(Message.deleted)
  }
}
