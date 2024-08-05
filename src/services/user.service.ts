import { AppDataSource } from '../config/database.config'
import { UserDetails } from '../entities/auth/details.entities'
import { Message } from '../constant/message'
import { Auth } from '../entities/auth/auth.entity'
import { UpdateDTO } from '../dto/user.dto'
import { EmailService } from './email.service'
import HttpException from '../utils/HttpException.utils'
import { generateHtml } from '../utils/mail.template'

class UserService {
  constructor(
    private readonly getDet = AppDataSource.getRepository(UserDetails),
    private readonly getDetails = AppDataSource.getRepository(Auth),
    private readonly mailService = new EmailService()
  ) {}
  async getById(id: string): Promise<Auth> {
    try {
      const query = this.getDetails.createQueryBuilder('auth')
      .leftJoinAndSelect('auth.details', 'details')
      .where('auth.id = :id', { id })

       
      const users = await query.getOne()
      if (!users) {
        throw HttpException.notFound('User not found')
      }
      console.log(users,"Users is hererree")
      return users
    } catch (error) {
      console.error('Error:', error)
      throw HttpException.internalServerError('Internal server error')
    }
  }

  async update(body: UpdateDTO, userId: string): Promise<string> {
    try {
      const id = userId
      console.log(userId)
      const user = await this.getById(id);
        (user.details.first_name = body.first_name),
        (user.details.middle_name = body.middle_name),
        (user.details.last_name = body.last_name),
        (user.details.phone_number = body.phone_number),
        (user.email = body.email),
        (user.username = body.username),
        await this.getDet.save(user.details)
      await this.getDetails.save(user)
      await this.getById(user.id)
      await this.mailService.sendMail({
        to: user.email,
        text:'Profile Updated Successfully',
        subject:'Profile Updated Successfully',
        html:generateHtml(`Profile Updated Successfully`)
      })
      return Message.updated
    } catch (error) {
      console.log(error, 'error in update')
      return Message.error
    }
  }

  async searchUser(userId: string, firstName: string, middleName: string, lastName: string) {
    try {
      const auth = await this.getDetails.findOneBy({ id: userId })
      if (!auth) throw HttpException.unauthorized

      const searchUser = this.getDet.createQueryBuilder('user')

      if (firstName) {
        searchUser.andWhere('user.first_name ILIKE :firstName', { firstName: `%${firstName}%` })
      }
      if (middleName) {
        searchUser.andWhere('user.middle_name ILIKE :middleName', { middleName: `%${middleName}%` })
      }
      if (lastName) {
        searchUser.andWhere('user.last_name ILIKE :lastName', { lastName: `%${lastName}%` })
      }
      const search = await searchUser.getMany()
      console.log('🚀 ~ UserService ~ searchUser ~ search:', search)

      return search
    } catch (error) {
      console.log('🚀 ~ UserService ~ searchUser ~ error:', error)
      throw HttpException.internalServerError
    }
  }
}

export default new UserService()