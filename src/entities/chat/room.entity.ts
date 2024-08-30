import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import Base from '../../entities/base.entity'
import { Chat } from './chat.entity'
import { Auth } from '../../entities/auth/auth.entity'

@Entity('room')
export class Room extends Base {
  @ManyToOne(() => Auth, (auth) => auth.sentRooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_id' })
  sender: Auth

  @ManyToOne(() => Auth, (auth) => auth.receivedRooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver_id' })
  receiver: Auth

  @OneToMany(() => Chat, (chat) => chat.room, { cascade: true })
  chat: Chat[]
}
