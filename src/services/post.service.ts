import { Post } from '../entities/posts/posts.entity'
import { AppDataSource } from '../config/database.config'
import { Message } from '../constant/message'
import { PostDTO } from '../dto/post.dto'
import { Auth } from '../entities/auth/auth.entity'
import PostMedia from '../entities/posts/postMedia.entity'
import HttpException from '../utils/HttpException.utils'

class PostService {
  constructor(
    private readonly postRepository = AppDataSource.getRepository(Post),
    private readonly getAuth = AppDataSource.getRepository(Auth),
    private readonly postMediaRepository = AppDataSource.getRepository(PostMedia)
  ) {}

  async createPost(data: any[], detail: PostDTO, userId: string): Promise<any> {
    try {
      const auth = await this.getAuth.findOneBy({ id: userId })
      if (!auth) throw HttpException.unauthorized(Message.notAuthorized)

      const post = this.postRepository.create({
        thought: detail.thought,
        feeling: detail.feeling,
        postIt: auth,
      })

      const savepost = await this.postRepository.save(post)
      const postImages: PostMedia[] = []

      for (const file of data) {
        const postImage = this.postMediaRepository.create({
          name: file.name,
          mimetype: file.mimetype,
          type: file.type,
          posts: savepost,
        })

        const savedImage = await this.postMediaRepository.save(postImage)
        postImages.push(savedImage)
        savedImage.transferImageFromTempToUpload(post.id, savedImage.type)
      }

      return Message.created
    } catch (error: any) {
      console.log(error?.message, 'error message')
      throw HttpException.badRequest(error?.message)
    }
  }

  async update(data: any[], detail: PostDTO, userId: string, postId: string): Promise<string> {
    console.log(postId)

    const auth = await this.getAuth.findOneBy({ id: userId })
    if (!auth) throw HttpException.unauthorized(Message.notAuthorized)
    const post = await this.postRepository.findOneBy({ id: postId })
    if (!post) throw HttpException.notFound
    post.thought = detail.thought
    post.feeling = detail.feeling
    await this.postRepository.save(post)
    return Message.updated
  }

  async delete(userId: string, postId: string): Promise<string> {
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
