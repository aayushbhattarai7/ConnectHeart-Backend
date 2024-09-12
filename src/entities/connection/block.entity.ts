import { Auth } from '../../entities/auth/auth.entity'
import Base from '../../entities/base.entity'
import { Entity, JoinColumn, ManyToOne } from 'typeorm'

@Entity('block_user')
export class BlockUser extends Base {
  @ManyToOne(() => Auth, (blocked_by) => blocked_by.auth, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blocked_by' })
  blocked_by: Auth

  @ManyToOne(() => Auth, (blocked_to) => blocked_to.auth, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blocked_to' })
  blocked_to: Auth
}
