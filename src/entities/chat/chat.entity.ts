import { Column, JoinColumn, ManyToOne, Entity, ManyToMany, OneToMany } from 'typeorm'
import Base from '../../entities/base.entity'
import { Auth } from '../../entities/auth/auth.entity'
import { Room } from './room.entity'
import ChatMedia from './chatMedia.entity'

@Entity('chat')
export class Chat extends Base {
  @Column({ name: 'message' })
  message: string

  @Column({ default: false })
  read: boolean

  @ManyToOne(() => Auth, (auth) => auth.sendMessage, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_id' })
  sender: Auth

  @ManyToOne(() => Auth, (auth) => auth.receiveMessage, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver_id' })
  receiver: Auth

  @OneToMany(() => ChatMedia, (chatMedia) => chatMedia.chats, { nullable: true })
  chatMedia: ChatMedia[]

  @ManyToOne(() => Room, (room) => room.chat, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: Room
}
