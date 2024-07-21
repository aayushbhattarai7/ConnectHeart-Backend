import { AppDataSource } from '../config/database.config'
import { UserDetails } from '../entities/auth/details.entities'
import { Message } from '../constant/message'
import { Auth } from '../entities/auth/auth.entity'
import { AuthDTO } from '../dto/user.dto'
import HttpException from '../utils/HttpException.utils'
import BcryptService from '../utils/bcrypt.utils'
import Auths from './auth.service'
class AuthService {
  constructor(
    private readonly getDetails = AppDataSource.getRepository(UserDetails),
    private readonly getAuth = AppDataSource.getRepository(Auth),
    private readonly bcryptService = new BcryptService()
  ) {}

  async create(data: AuthDTO): Promise<Auth> {
    try {
      const auth = this.getAuth.create({
        email: data.email,
        username: data.username,
        password: await this.bcryptService.hash(data.password),
      })
      await this.getAuth.save(auth)

      const details = this.getDetails.create({
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        auth: auth,
      })
      await this.getDetails.save(details)
      return auth
    } catch (error: any) {
      console.log('🚀  error:', error?.message)
      throw HttpException.badRequest(error?.message)
    }
  }

  async login(data: AuthDTO): Promise<Auth> {
    try {
      const user = await this.getAuth.findOne({
        where: [{ email: data.email }],
        select: ['id', 'email', 'password'],
      })
      console.log(user?.email)
      if (!user) throw HttpException.notFound(Message.notFound)
      const passwordMatched = await this.bcryptService.compare(data.password, user.password)
      console.log('🚀 ~ AuthService ~ login ~ passwordMatched:', passwordMatched)
      if (!passwordMatched) {
        throw new Error('Incorrect Password')
      }

      const userid = await Auths.getById(user.id)
      console.log(userid, 'okok')
      return await Auths.getById(user.id)
    } catch (error) {
      throw HttpException.notFound(Message.error)
    }
  }
}

export default new AuthService()
