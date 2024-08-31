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
      const parents = null

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

  async commentReply(data: CommentDTO, userId: string, postId: string, commentId: string) {
    try {
      const auth = await this.authRepo.findOneBy({ id: userId })
      if (!auth) throw HttpException.unauthorized

      const post = await this.postRepo.findOneBy({ id: postId })
      if (!post) throw HttpException.notFound('Post Not Found')
      console.log(data.comment)
      const parents = await this.commentRepo.findOneBy({ id: commentId })

      const comments = this.commentRepo.create({
        comment: data.comment,
        parentComment: parents,
        commentAuth: auth,
        posts: post,
      })
      await this.commentRepo.save(comments)
      return comments
    } catch (error) {
      console.log(error)
      return Message.error
    }
  }
  async getComments(postId: string) {
    try {
      const post = await this.postRepo.findOneBy({ id: postId })
      if (!post) throw HttpException.notFound
      const comments = await this.commentRepo
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.posts', 'posts')
        .leftJoinAndSelect('comment.commentAuth', 'commentAuth')
        .leftJoinAndSelect('commentAuth.details', 'details')
        .where('comment.post_id =:postId', { postId })
        .getMany()
      return comments
    } catch (error) {
      return error
    }
  }

  async updateComments(userId: string, data: CommentDTO, commentId: string) {
    try {
      if (!userId) throw HttpException.unauthorized

      if (!commentId) throw HttpException.notFound('Comment not Found')
      const comment = await this.commentRepo
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.commentAuth', 'auth')
        .where('comment.auth_id = :userId', { userId })
        .andWhere('comment.id = :commentId', { commentId })
        .getOne()
      if (!comment) throw HttpException.notFound('nono')

      comment.comment = data.comment
      await this.commentRepo.save(comment)
      return Message.success
    } catch (error) {
      console.log('🚀 ~ CommentService ~ updateComments ~ error:', error)
    }
  }

  async deleteComments(userId: string, commentId: string): Promise<string> {
    try {
      await this.commentRepo
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.childComment', 'childComment')
        .delete()
        .where('comment.auth_id = :userId', { userId })
        .where('comment.id = :commentId', { commentId })
        .execute()

      return Message.success
    } catch (error) {
      console.log('🚀 ~ CommentService ~ deleteComments ~ error:', error)
      throw HttpException.internalServerError(Message.error)
    }
  }

  async getPostComment() {
    try {
      const comments = await this.postRepo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.comment', 'comment')
        .leftJoinAndSelect('comment.parentComment', 'parentComment')
        .leftJoinAndSelect('comment.childComment', 'childComment')
        .where('post.id = comment.post_id')
        .getMany()
      return comments
    } catch (error) {
      console.log('🚀 ~ CommentService ~ getPostComment ~ error:', error)
    }
  }
}
export default new CommentService()