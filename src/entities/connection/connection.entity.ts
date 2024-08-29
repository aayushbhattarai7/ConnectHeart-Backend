import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import Base from '../base.entity';
import { Auth } from '../../entities/auth/auth.entity';
import { Status } from '../../constant/enum';
import { Chat } from '../../entities/chat/chat.entity';
import { Room } from '../../entities/chat/room.entity';

@Entity('connect')
export class Connect extends Base {
  @ManyToOne(() => Auth, sender => sender.connect)
  @JoinColumn({ name: 'sender_id' })
  sender: Auth;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status.PENDING;

  @ManyToOne(() => Auth, receiver => receiver.connects)
  @JoinColumn({ name: 'receiver_id' })
  receiver: Auth;

  // @ManyToOne(()=> Room,(senderId) => senderId.sender)
  // @JoinColumn({ name: 'sender_id' })

  // senderId: Room

  // @ManyToOne(()=> Room,(receiverId) => receiverId.receiver)
  // @JoinColumn({ name: 'receiver_id' })
  // receiverId: Room
}
