import fs from 'fs'
import path from 'path'
import { Post } from '../entities/posts/posts.entity'
import { AppDataSource } from '../config/database.config'
import { Message } from '../constant/message'
import { postDTO, updatePostDTO } from '../dto/post.dto'
import { Auth } from '../entities/auth/auth.entity'
import PostMedia from '../entities/posts/postMedia.entity'
import HttpException from '../utils/HttpException.utils'
import { MediaType } from '../constant/enum'
import { getTempFolderPathForPost } from '../utils/path.utils'
import { IMulterOutput } from '../interface/multer.interface'

class PostService {
  constructor(
    private readonly postRepository = AppDataSource.getRepository(Post),
    private readonly getAuth = AppDataSource.getRepository(Auth),
    private readonly postMediaRepository = AppDataSource.getRepository(PostMedia)
  ) {}
//
  async createPost(data: any[], detail: postDTO, userId:string): Promise<any> {
    
    try {
      const auth = await this.getAuth.findOneBy({ id: userId })
      if (!auth) throw HttpException.unauthorized(Message.notAuthorized)
      const postimages: PostMedia[] = [];
      for (const datas of data) {
        const postImage = this.postMediaRepository.create({
          name: datas.name,
          mimetype: datas.mimetype,
          type: datas.type,
          
        })
  
        const postimg = await this.postMediaRepository.save(postImage)
        postimages.push(postimg)
      }
      const post = this.postRepository.create({
        thought: detail.thought,
        feeling: detail.feeling,
        postImage: postimages,
        postIt:auth
        
      })
      await this.postRepository.save(post)
      for(const postImage of postimages){
         postImage.transferImageFromTempToUpload(postImage.id, postImage.type)
      return Message.created
      }

      
     
    } catch (error: any) {
      console.log(error?.message, 'error message')
      throw HttpException.badRequest(error?.message)
    }
  }

  async update(data: updatePostDTO, userId: string): Promise<string> {
    const postId = data.id
    console.log(postId)

    const auth = await this.getAuth.findOneBy({ id: userId })
    if (!auth) throw HttpException.unauthorized(Message.notAuthorized)
    const post = await this.postRepository.findOneBy({ id: postId })
    if (!post) throw HttpException.notFound

    post.thought = data.thought
    post.feeling = data.feeling
    await this.postRepository.save(post)
    return Message.updated
  }

  async delete(userId: string, postId: string, data: postDTO): Promise<string> {
    try {
      const auth = await this.getAuth.findOneBy({ id: userId })
      if (!auth) throw HttpException.unauthorized(Message.notAuthorized)

      const post = await this.postRepository.findOneBy({ postIt: auth })
      if (!post) throw HttpException.forbidden

      await this.postRepository.delete(postId)
      this.postRepository.delete(postId)
      return postId
    } catch (error) {
      console.log(error)
      return Message.error
    }
  }
}
export default new PostService()
