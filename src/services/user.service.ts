import { AppDataSource } from '../config/database.config'
import { UserDetails } from '../entities/auth/details.entities'
import { Message } from '../constant/message'
import { Auth } from '../entities/auth/auth.entity'
import { AuthDTO } from '../dto/user.dto'
import HttpException from '../utils/HttpException.utils'
import BcryptService from '../utils/bcrypt.utils'
import UserService from './auth.service'
class AuthService {
  constructor(
    private readonly getDet = AppDataSource.getRepository(UserDetails),
    private readonly getDetails = AppDataSource.getRepository(Auth),
    private readonly bcryptService = new BcryptService()
  ) {}

  async create(data: AuthDTO): Promise<string> {
    const user = new UserDetails()
    user.first_name = data.first_name
    user.middle_name = data.middle_name
    user.last_name = data.last_name
    user.phone_number = data.phone_number
    const auth = new Auth()
    auth.email = data.email
    auth.username = data.username
    auth.password = await this.bcryptService.hash(data.password)
    user.auth = auth
    await auth.save()
    await user.save()
    console.log('User details saved successfully')
    return Message.created
  }

  async login(data: AuthDTO): Promise<Auth> {
    try {
      const user = await this.getDetails.findOne({
        where: [{ email: data.email }],
        select: ['id', 'email', 'password'],
      })
      if (!user) throw HttpException.notFound(Message.invalidCredentials)
      const passwordMatched = await this.bcryptService.compare(data.password, user.password)
      if (!passwordMatched) {
        throw new Error('aayush vai pada')
      }
      return await UserService.getById(user.id)
    } catch (error) {
      throw HttpException.notFound(Message.invalidCredentials)
    }
  }
}

export default new AuthService()
