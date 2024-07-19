import { Comment } from '../entities/comment/comment.entity'
import { AppDataSource } from '../config/database.config'
import { Auth } from '../entities/auth/auth.entity'
import { Message } from '../constant/message'
import { CommentDTO } from '../dto/comment.dto'
import HttpException from '../utils/HttpException.utils'
import { Post } from '../entities/posts/posts.entity'

class CommentService {
  constructor(
    private readonly commentRepo = AppDataSource.getRepository(Comment),
    private readonly authRepo = AppDataSource.getRepository(Auth),
    private readonly postRepo = AppDataSource.getRepository(Post)
  ) {}
  async comment(data: CommentDTO, userId: string, postId: string): Promise<string> {
    try {
      const auth = await this.authRepo.findOneBy({ id: userId })
      if (!auth) throw HttpException.unauthorized

      const post = await this.postRepo.findOneBy({ id: postId })
      if (!post) throw HttpException.notFound('Post Not Found')
      console.log(data.comment)
      let parents = null
      parents = await this.commentRepo.findOneBy({ id: data.parentId })

      const comments = this.commentRepo.create({
        comment: data.comment,
        parentComment: parents,
        commentAuth: auth,
        posts: post,
      })
      await this.commentRepo.save(comments)
      return Message.created
    } catch (error) {
      console.log(error)
      return Message.error
    }
  }

  async getComments(postId: string) {
    try {
      const post = await this.postRepo.findOneBy({ id: postId })
      if (!post) throw HttpException.unauthorized('You are not logged in, PLease Login to access your comments')
      const comments = await this.commentRepo
        .createQueryBuilder('comment')
        .leftJoinAndMapOne('comment.post', Post, 'post', 'post.id = comment.post_id')
        .getMany()

      return comments
    } catch (error) {
      return error
    }
  }

  
}
export default new CommentService()
