import Base from '../../entities/base.entity'
import { Column, Entity, ManyToOne, JoinColumn, TreeChildren, TreeParent, Tree } from 'typeorm'
import { Auth } from '../../entities/auth/auth.entity'
import { Post } from '../../entities/posts/posts.entity'

@Entity('comment')
@Tree('closure-table')
export class Comment extends Base {
  @Column({ name: 'comment' })
  comment: string

  @TreeParent()
  @JoinColumn({ name: 'parent_id' })
  parentComment: Comment | null

  @TreeChildren()
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
