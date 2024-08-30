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

/*  // if(detail){
            //     for(const file of detail) {
            //         const chatImage = this.chatMediaRepo.create({
            //             name:file.name,
            //             mimetype:file.mimetype,
            //             type:file.type,
            //             chats:saveChat
            //         })
            //         const saveImage = await this.chatMediaRepo.save(chatImage)
            //         saveImage.transferImageFromTempToUpload(chat.id, saveImage.type)
            //     }
            // }else{
            //     console.log("hello")
            // } */
