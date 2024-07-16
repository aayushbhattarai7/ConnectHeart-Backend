import { AppDataSource } from '../config/database.config'
import { userDetails } from '../entities/auth/details.entities'
import { Message } from '../constant/message'
import { Auth } from '../entities/auth/auth.entity'
import { AuthDTO, DetailDTO, UpdateDTO } from '../dto/user.dto'
import HttpException from '../utils/HttpException.utils'
class UserService {
  constructor(
    private readonly getDet = AppDataSource.getRepository(userDetails),
    private readonly getDetails = AppDataSource.getRepository(Auth)
  ) {}
  async getById(id: string, details: boolean = true): Promise<Auth> {
    try {
      const query = this.getDetails.createQueryBuilder('auth').where('auth.id = :id', { id })

      if (details) query.leftJoinAndSelect('auth.details', 'details')
      const users = await query.getOne()
      if (!users) {
        throw new HttpException('User not found', 404)
      }
      console.log(users)
      return users
    } catch (error) {
      console.error('Error:', error)
      throw new HttpException('Internal server error', 500)
    }
  }
  async update(body: UpdateDTO, userId: string): Promise<string> {
    try {
      const id = userId
      console.log(userId)
      const user = await this.getById(id);
      user.details.first_name = body.first_name,
        user.details.middle_name = body.middle_name,
        user.details.last_name = body.last_name,
        user.details.phone_number = body.phone_number,
        user.email = body.email,
        user.username = body.username,
        await this.getDet.save(user.details)
      await this.getDetails.save(user)
      await this.getById(user.id)
      return Message.updated
    } catch (error) {
      console.log(error, 'error in update')
      return Message.error
    }
  }
}

export default new UserService()
