import { JoinColumn, Column, Entity, OneToMany, ManyToOne } from 'typeorm'
import Base from '../base.entity'
import PostMedia from './postMedia.entity'
import { Auth } from '../../entities/auth/auth.entity'
import { Comment } from '../../entities/comment/comment.entity'

@Entity('post')
export class Post extends Base {
  @Column({ name: 'thought' })
  thought: string

  @Column({ name: 'feeling' })
  feeling: string

  @OneToMany(() => PostMedia, (postMedia) => postMedia.posts)
  postImage: Post[]

  @OneToMany(() => Comment, (comments) => comments.posts)
  comment: Post[]

  @ManyToOne(() => Auth, (postIt) => postIt.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_id' })
  postIt: Auth
}
