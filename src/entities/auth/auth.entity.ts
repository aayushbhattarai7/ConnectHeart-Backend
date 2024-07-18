import { Column, Entity, OneToOne, OneToMany } from 'typeorm'
import { UserDetails } from './details.entities'
import { Role } from '../../constant/enum'
import Base from '../base.entity'
import { Post } from '../posts/posts.entity'
import { Comment } from '../../entities/comment/comment.entity'
@Entity('auth')
export class Auth extends Base {
  @Column({
    unique: true,
  })
  email: string

  @Column({
    unique: true,
  })
  username: string

  @Column({ select: false })
  password: string

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role

  @OneToOne(() => UserDetails, (details) => details.auth, { cascade: true })
  details: UserDetails

  @OneToMany(() => Post, (post) => post.postIt, { cascade: true })
  posts: Post

  @OneToMany(() => Comment, (comment) => comment.commentAuth, { cascade: true })
  comments: Auth

  @Column({ nullable: true })
  tokens: string
}
