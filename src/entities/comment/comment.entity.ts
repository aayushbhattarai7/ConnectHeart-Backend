import Base from '../../entities/base.entity'
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { Auth } from '../../entities/auth/auth.entity'
import { Post } from '../../entities/posts/posts.entity'

@Entity('comment')
export class Comment extends Base {
  @Column({ name: 'comment' })
  comment: string

  @ManyToOne(() => Comment, (comment) => comment.childComment)
  @JoinColumn({ name: 'parent_id' })
  parentComment: Comment | null

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  childComment: Comment[]

  @ManyToOne(() => Auth, (commentAuth) => commentAuth.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_id' })
  commentAuth: Auth

  @ManyToOne(() => Post, (posts) => posts.comment)
  @JoinColumn({ name: 'post_id' })
  posts: Post
}
