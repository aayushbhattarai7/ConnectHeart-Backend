import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import Base from '../base.entity'
import { Auth } from '../../entities/auth/auth.entity'
import { Status } from '../../constant/enum'
import { Chat } from '../../entities/chat/chat.entity'
import { Room } from '../../entities/chat/room.entity'

@Entity('connect')
export class Connect extends Base {
  @ManyToOne(() => Auth, (sender) => sender.connect, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_id' })
  sender: Auth

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status.PENDING

  @ManyToOne(() => Auth, (receiver) => receiver.connects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver_id' })
  receiver: Auth

  @ManyToOne(() => Auth, (people) => people.blockedBy, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({
    name: 'blocked_by',
  })
  people: Auth
}
