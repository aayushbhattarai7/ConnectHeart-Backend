import { Column, JoinColumn, ManyToOne, Entity, ManyToMany } from "typeorm";
import Base from "../../entities/base.entity";
import { Auth } from "../../entities/auth/auth.entity";
import { Room } from "./room.entity";

@Entity('chat')
export class Chat extends Base {
    @Column({ name: 'message' })
    message: string;

    @ManyToOne(() => Auth, (auth) => auth.sendMessage, { cascade: true })
    @JoinColumn({ name: 'sender_id' })
    sender: Auth;

    @ManyToOne(() => Auth, (auth) => auth.receiveMessage, { cascade: true })
    @JoinColumn({ name: 'receiver_id' })
    receiver: Auth;

    

    @ManyToOne(() => Room, (room) => room.chat)
    @JoinColumn(({name:'room_id'}))
    room: Room;

}
