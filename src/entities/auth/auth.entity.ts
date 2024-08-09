import { Column, Entity, OneToOne, OneToMany, ManyToOne, ManyToMany} from 'typeorm'
import { UserDetails } from './details.entities'
import { Role } from '../../constant/enum'
import Base from '../base.entity'
import { Post } from '../posts/posts.entity'
import { Comment } from '../../entities/comment/comment.entity'
import { Connect } from '../../entities/connection/connection.entity'
import { Like } from '../../entities/like/like.entity'
import Profile from './profile.entity'
@Entity('auth')
export class Auth extends Base {
  @Column({
    unique: true,
    nullable:false
  })
  email: string

  @Column({ select: false , nullable:false})
  password: string

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role

  @Column({name:'verified', default:false})
  Verified:boolean

  @OneToOne(() => UserDetails, (details) => details.auth, { cascade: true })
  details: UserDetails

  @OneToOne(()=> Profile, (profile)=> profile.auth, {cascade:true, nullable:true})
  profile:Profile

  @OneToMany(() => Post, (post) => post.postIt, { cascade: true })
  posts: Post

  @OneToMany(() => Comment, (comment) => comment.commentAuth, { cascade: true })
  comments: Comment[]

  @OneToMany(() => Connect, (connect) => connect.sender, { cascade: true })
  connect: Connect[]

  @OneToMany(() => Connect, (connects) => connects.receiver, { cascade: true })
  connects: Connect[]

  @OneToMany(() => Like, (like) => like.auth, { cascade: true })
    likes: Like[];
}
