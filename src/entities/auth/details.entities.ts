import { AfterLoad, Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import Base from '../base.entity'
import { Auth } from './auth.entity'
@Entity('users')
export class UserDetails extends Base {
  @Column({ name: 'first_name', nullable:false })
  first_name: string

  @Column({ name: 'middle_name', nullable: true })
  middle_name: string

  @Column({ name: 'last_name', nullable:false })
  last_name: string

  @Column({ name: 'phone_number', nullable: true })
  phone_number: string

  @OneToOne(() => Auth, (auth) => auth.details, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_id' })
  auth: Auth

}