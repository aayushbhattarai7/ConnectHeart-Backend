import { type Request, type Response } from 'express'
import { Message } from '../constant/message'
import { StatusCodes } from '../constant/StatusCodes'
import PostService from '../services/post.service'
import { postDTO, updatePostDTO } from '../dto/post.dto'
import HttpException from '../utils/HttpException.utils'
import postService from '../services/post.service'
export class PostController {
  async create(req: Request, res: Response) {
    const userId = req?.user?.id
    console.log(userId)
    if(req?.files?.length ===0) throw HttpException.badRequest
    console.log(req?.files)
    const data = req?.files?.map((file:any) => {
      return {
        name:file?.filename,
        mimetype:file?.mimetype,
        
        type:req.body?.type,
      }
    })
    await postService.createPost( data as any , req.body as postDTO, userId as string)
    res.status(StatusCodes.CREATED).json({
      status:true,
      data,
      message:Message.created,
    })
  }
  async update(req: Request, res: Response) {
    const userId = req.user?.id
    await PostService.update(req.body as updatePostDTO, userId as string)
    res.status(StatusCodes.SUCCESS).json(Message.updated)
  }

  async delete(req: Request, res: Response) {
    const userId = req.user?.id
    const postId = req.params.id
    console.log(postId, 'posttttt')
    await PostService.delete(userId as string, postId, req.body as postDTO)
    res.status(StatusCodes.SUCCESS).json(Message.deleted)
  }
}
