import { Column, Entity, OneToOne, OneToMany } from "typeorm";
import { userDetails } from "./details.entities";
import {AdminAllowedFetures, Role} from '../../constant/enum'
import Base from "../base.entity";
import {Post} from '../posts/posts.entity'
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
    
    @Column({
        type: 'enum',
        enum: Role,
        default:Role.USER
    })
    role:Role

   

    @OneToOne(() =>userDetails, (details) => details.auth, {cascade: true})
    details: userDetails

    @OneToMany(() =>Post, (post) => post.postIt, {cascade: true})
    posts: Post


    @Column({nullable:true})
    tokens: string

}