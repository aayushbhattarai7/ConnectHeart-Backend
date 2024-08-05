import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import Base from "../../entities/base.entity";
import { Auth } from "../../entities/auth/auth.entity";
import { Post } from "../../entities/posts/posts.entity";

@Entity('likes')
export class Like extends Base {

    @ManyToOne(() => Auth, (auth) => auth.likes)
    @JoinColumn({ name: 'auth_id' })
    auth: Auth;

    @ManyToOne(() => Post, (post) => post.likes)
    @JoinColumn({ name: 'post_id' })
    post: Post;
}