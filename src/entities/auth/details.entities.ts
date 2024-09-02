import { AfterLoad, Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import Base from '../base.entity'
import { Auth } from './auth.entity'
import { Gender } from '../../constant/enum'
@Entity('users')
export class UserDetails extends Base {
  @Column({ name: 'first_name', nullable: false })
  first_name: string

  @Column({ name: 'last_name' })
  last_name: string

  @Column({ name: 'phone_number', nullable: true })
  phone_number: string

  @Column({ type: 'enum', enum: Gender })
  gender: Gender

  @OneToOne(() => Auth, (auth) => auth.details, {
        onDelete: 'CASCADE',

  })
  @JoinColumn({ name: 'auth_id' })
  auth: Auth
}
