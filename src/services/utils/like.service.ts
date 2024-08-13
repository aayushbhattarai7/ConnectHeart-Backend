import { Like } from "../../entities/like/like.entity";
import { AppDataSource } from "../../config/database.config";
import { Auth } from "../../entities/auth/auth.entity";
import { LikeDTO } from "../../dto/like.dto";
import HttpException from "../../utils/HttpException.utils";
import { Post } from "../../entities/posts/posts.entity";


 class LikeService {
    constructor(
        private readonly likeRepo = AppDataSource.getRepository(Like),
        private readonly AuthRepo = AppDataSource.getRepository(Auth),
        private readonly postRepo = AppDataSource.getRepository(Post)

    ) { }

    async like(userId: string, postId: string) {
        try {
            const auth = await this.AuthRepo.findOneBy({ id: userId })
            if (!auth) throw HttpException.unauthorized

            const post = await this.postRepo.findOneBy({id:postId})
            if(!post) throw HttpException.notFound
            
          const likes = this.likeRepo.create({
            isLiked:true,
           auth:auth,
           post:post
          })
          await this.likeRepo.save(likes)

            await this.likeRepo.save(likes)
            console.log("🚀 ~ LikeService ~ like ~ post:", post)
            return likes
        } catch (error) {
            throw HttpException.badRequest('could not save')
        }
    }

   async dislike(userId: string, postId: string) {
    console.log("Attempting to dislike post");

    try {
        const auth = await this.AuthRepo.findOneBy({ id: userId });
        if (!auth) throw new Error('Unauthorized');

        const post = await this.postRepo.findOneBy({ id: postId });
        if (!post) throw new Error('Post not found');

       

        console.log('Deleting like with userId:', userId, 'postId:', postId);

        await this.likeRepo
            .createQueryBuilder()
            .delete()
            .from(Like) 
            .where('auth.id = :userId', { userId })
            .andWhere('post.id = :postId', { postId })
            .execute();

        console.log('Like deleted successfully');

        return 'Success';
    } catch (error) {
        console.error('Error during dislike operation:', error);
        throw new Error;
        
    }
}


    async changeLike(userId: string, postId: string) {
        try {

            console.log("hello223");
            
            const changelikes = await this.likeRepo.createQueryBuilder('like')
                .where('like.auth_id =:userId', { userId })
                .andWhere('like.post_id =:postId', { postId })
                .getOne()
                console.log('ajdnj')
            console.log("🚀 ~ LikeService ~ changeLike ~ changelikes:", changelikes)

            if (changelikes) {
                await this.dislike(userId, postId)
            } else {
                await this.like(userId, postId)
            }
            return changelikes
        } catch (error) {
            console.log(error)
        }
    }

    async getLikeCount(userId:string, postId:string):Promise<Number> {
        try {
            const likeCount = await this.likeRepo.count({ where: { post: { id: postId } } });
            return likeCount
        } catch (error) {
            throw HttpException.badRequest
        }
    
}
 }
export default LikeService


  