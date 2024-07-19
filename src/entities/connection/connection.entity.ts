import { Column,Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import Base from '../base.entity'
import { Auth } from '../../entities/auth/auth.entity'
import { Status } from '../../constant/enum'

@Entity('connect')
export class Connect extends Base {
  @ManyToOne(() => Auth, (sender) => sender.connect)
  @JoinColumn({ name: 'sender_id' })
  sender: Auth

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status.PENDING

  @ManyToOne(() => Auth, (receiver) => receiver.connects)
  @JoinColumn({ name: 'receiver_id' })
  receiver: Auth
}
