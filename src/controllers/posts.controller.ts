import { type Request, type Response } from 'express'
import { Message } from '../constant/message'
import { StatusCodes } from '../constant/StatusCodes'
import PostService from '../services/post.service'
import { PostDTO } from '../dto/post.dto'
import HttpException from '../utils/HttpException.utils'
import postService from '../services/post.service'
export class PostController {
  async create(req: Request, res: Response) {
    const userId = req?.user?.id
    const body = req.body
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
    
    await postService.createPost(data as any, body , userId as string)
    
    res.status(StatusCodes.CREATED).json({
      status: true,
      body,
      data,
      message: Message.created,
    })
  }

  async getPost(req:Request, res:Response){
    const userId = req.user?.id

    await postService.getPosts(userId as string)
    res.status(StatusCodes.CREATED).json({
      status: true,
      message: Message.loginSuccessfully,
    })

  }
  async update(req: Request, res: Response) {
    const userId = req.user?.id
    const postId = req.params.id
    const data = req?.files?.map((file:any) => {
      return {
        name: file?.filename,
        mimetype:file?.mimetype,
        type:req.body?.type
      }
    })
    await PostService.update(data as any, req.body as PostDTO, userId as string, postId as string)
    res.status(StatusCodes.SUCCESS).json(Message.updated)
  }

  // async delete(req: Request, res: Response) {
  //   const userId = req.user?.id
  //   const postId = req.params.id
  //   console.log(postId, 'posttttt')
  //   await PostService.delete(userId as string, postId, req.body as PostDTO)
  //   res.status(StatusCodes.SUCCESS).json(Message.deleted)
  // }
}
