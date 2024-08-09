import { Post } from '../entities/posts/posts.entity'
import { Comment } from '../entities/comment/comment.entity'
import { AppDataSource } from '../config/database.config'
import { Message } from '../constant/message'
import { PostDTO } from '../dto/post.dto'
import { Auth } from '../entities/auth/auth.entity'
import PostMedia from '../entities/posts/postMedia.entity'
import HttpException from '../utils/HttpException.utils'
import { transferImageFromUploadToTemp } from '../utils/path.utils'
import { IsNull } from 'typeorm'
class PostService {
  constructor(
    private readonly postRepository = AppDataSource.getRepository(Post),
    private readonly getAuth = AppDataSource.getRepository(Auth),
    private readonly postMediaRepository = AppDataSource.getRepository(PostMedia),
    private readonly commentRepo = AppDataSource.getRepository(Comment)
  ) {}

  async createPost(data: any[], detail: PostDTO, userId: string): Promise<string> {
    try {
      const auth = await this.getAuth.findOneBy({ id: userId })
      if (!auth) throw HttpException.unauthorized(Message.notAuthorized)

      const post = this.postRepository.create({
        thought: detail.thought,
        feeling: detail.feeling,
        postIt: auth,
      })

      const savepost = await this.postRepository.save(post)
      for (const file of data) {
        const postImage = this.postMediaRepository.create({
          name: file.name,
          mimetype: file.mimetype,
          type: file.type,
          posts: savepost,
        })

        const savedImage = await this.postMediaRepository.save(postImage)
        savedImage.transferImageFromTempToUpload(post.id, savedImage.type)
      }

      return Message.created
    } catch (error: any) {
      console.log(error?.message, 'error message')
      throw HttpException.badRequest(error?.message)
    }
  }

  async updatePost(data: any[], detail: PostDTO, userId: string, postId: string): Promise<string> {
    try {
      const auth = await this.getAuth.findOneBy({ id: userId })
      if (!auth) throw HttpException.unauthorized(Message.notAuthorized)

      const post = await this.postRepository.findOneBy({ id: postId })
      if (!post) throw HttpException.notFound

      post.thought = detail.thought
      post.feeling = detail.feeling
      const updatedPost = await this.postRepository.save(post)
      const media = await this.postMediaRepository.find({
        where: { posts: { id: postId } },
        relations: ['posts'],
      })

      if (media.length > 0) {
        for (const mediaItem of media) {
          transferImageFromUploadToTemp(post.id, mediaItem.name, mediaItem.type)
        }

        await this.postMediaRepository
          .createQueryBuilder()
          .delete()
          .from(PostMedia)
          .where('posts.id = :postId', { postId })
          .execute()
      }

      for (const file of data) {
        const saveMedia = new PostMedia()
        saveMedia.name = file.name
        saveMedia.mimetype = file.mimetype
        saveMedia.type = file.type
        saveMedia.posts = updatedPost

        const savedImage = await this.postMediaRepository.save(saveMedia)
        savedImage.transferImageFromTempToUpload(post.id, savedImage.type)
        console.log(savedImage)
      }

      return Message.updated
    } catch (error: any) {
      console.log('🚀 ~ PostService ~ update ~ error:', error?.message)
      throw HttpException.badRequest(error?.message)
    }
  }

  async getPost(postId: string): Promise<object> {
    try {
      const fetchPost = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.postIt', 'postIt') 
      .leftJoinAndSelect('post.postImage', 'image') 
      .leftJoinAndSelect('post.comment', 'comment') 
      .leftJoinAndSelect('comment.childComment', 'childComment') 
      .leftJoinAndSelect('comment.parentComment', 'parentComment') 
      .where('post.id = :postId', { postId })
      .getOne();
      if (!fetchPost) throw HttpException.notFound('post not found')
      return fetchPost
    } catch (error) {
      console.log('🚀 ~ PostService ~ getPost ~ error:', error)
      throw HttpException.internalServerError
    }
  }

async getAllPost():Promise<Post[]> {
  try {
    const posts = await this.postRepository.find({
      relations: [
        'postIt',
        'postIt.details',
        'postIt.profile',
        'postImage',
        'comment',
        'comment.commentAuth', 
        'comment.commentAuth.details',
        'comment.commentAuth.profile',
        'comment.childComment',
        'comment.childComment.childComment',
        'comment.childComment.parentComment',
        'comment.parentComment',
        
      ],
    });

    if (!posts.length) throw HttpException.notFound('Posts not found');

    for (const post of posts) {
      const parentComments = await this.commentRepo.find({
        where: {
          posts: { id: post.id },
          parentComment: IsNull(),
        },
        relations: ['childComment', 'commentAuth', 'commentAuth.details', 'commentAuth.profile'], 
      });

      for (const comment of parentComments) {
        await this.fetchReplies(comment);
      }
      post.comment = parentComments;
    }

    return posts;
  } catch (error) {
    console.error("🚀 ~ PostService ~ getAllPost ~ error:", error);
    throw HttpException.internalServerError
  }
}

async fetchReplies(comment: Comment): Promise<void> {
  const childs = await this.commentRepo.find({
    where: { parentComment: { id: comment.id } },
    relations: ['childComment', 'commentAuth', 'commentAuth.details','commentAuth.profile'], 
  });

  comment.childComment = childs;
  for (const child of childs) {
    await this.fetchReplies(child);
  }
    
  }

  async getUserPost(userId: string): Promise<object> {
    try {
      const fetchPost = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.postIt', 'postIt')
        .leftJoinAndSelect('postIt.details','details')
        .leftJoinAndSelect('postIt.profile','profile')
        .leftJoinAndSelect('post.postImage', 'image')
        .leftJoinAndSelect('post.comment','comment')
        .leftJoinAndSelect('comment.commentAuth','commentAuth')
        .leftJoinAndSelect('comment.childComment','childComment')
        .leftJoinAndSelect('comment.parentComment','parentComment')
        .leftJoinAndSelect('childComment.parentComment','grandComment')
        .leftJoinAndSelect('childComment.childComment','grandChildComment')


        .where('post.auth_id = :userId', { userId })
        .getMany()
      if (!fetchPost) throw HttpException.notFound('post not found')
        if (!fetchPost.length) throw HttpException.notFound('Posts not found');

      for (const post of fetchPost) {
        const parentComments = await this.commentRepo.find({
          where: {
            posts: { id: post.id },
            parentComment: IsNull(),
          },
          relations: ['childComment', 'commentAuth', 'commentAuth.details', 'commentAuth.profile'], 
        });
  
        for (const comment of parentComments) {
          await this.fetchReplies(comment);
        }
        post.comment = parentComments;
      }
  
      return fetchPost
    } catch (error) {
      console.log('🚀 ~ PostService ~ getPost ~ error:', error)
      throw HttpException.internalServerError
    }
  }

  async delete(userId: string, postId: string): Promise<string> {
    try {
      const auth = await this.getAuth.findOneBy({ id: userId })
      if (!auth) throw HttpException.unauthorized(Message.notAuthorized)

      const post = await this.postRepository
        .createQueryBuilder('post')
        .where('post.auth_id =:userId', { userId })
        .andWhere('post.id =:postId', { postId })
        .getOne()

      if (!post) throw HttpException.forbidden

      await this.postMediaRepository
        .createQueryBuilder('postimage')
        .delete()
        .where('postimage.post_id =:postId', { postId })
        .execute()

      const comment = await this.commentRepo
        .createQueryBuilder()
        .delete()
        .from('comment')
        .where('comment.post_id =:postId', { postId })
        .execute()

      await this.postRepository
        .createQueryBuilder('post')
        .delete()
        .where('post.auth_id =:userId', { userId })
        .andWhere('post.id =:postId', { postId })
        .execute()
      return Message.deleted
    } catch (error) {
      console.log(error)
      return Message.error
    }
  }
}
export default new PostService()