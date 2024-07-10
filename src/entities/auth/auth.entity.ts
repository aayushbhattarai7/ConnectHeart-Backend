import { Column, Entity, OneToOne } from "typeorm";
import { userDetails } from "./details.entities";
import Base from "../base.entity";
@Entity('auth')
export class Auth extends Base {
    @Column({
        unique: true
    })
    email:string

    @Column({
        unique: true,
    })
    username: string

    @Column({select:false})
    password: string


    @OneToOne(() =>userDetails, (details) => details.auth, {cascade: true})
    details: userDetails

}