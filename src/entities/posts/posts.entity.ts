import { JoinColumn, Column, Entity, OneToMany, ManyToOne } from 'typeorm'
import Base from '../base.entity'
import { MediaType } from '../../constant/enum'
import { IsNotEmpty } from 'class-validator'
import PostMedia from './postMedia.entity'
import { Auth } from '../../entities/auth/auth.entity'

@Entity('post')
export class Post extends Base {
  @Column({ name: 'thought' })
  thought: string

  @Column({ name: 'feeling' })
  feeling: string

  @OneToMany(() => PostMedia, (postMedia) => postMedia.posts)
  postImage: Post[]

  @ManyToOne(() => Auth, (postIt) => postIt.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_id' })
  postIt: Auth
}
