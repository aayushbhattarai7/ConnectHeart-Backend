import { AppDataSource } from '../config/database.config'
import { UserDetails } from '../entities/auth/details.entities'
import { Message } from '../constant/message'
import { Auth } from '../entities/auth/auth.entity'
import { AuthDTO, ResetPasswordDTO } from '../dto/user.dto'
import HttpException from '../utils/HttpException.utils'
import BcryptService from '../utils/bcrypt.utils'
import Auths from './user.service'
import { jwtDecode } from 'jwt-decode'
import { EmailService } from './email.service'
import UserService from './user.service'
import { generateHtml } from '../utils/mail.template'
class AuthService {
  constructor(
    private readonly getDetails = AppDataSource.getRepository(UserDetails),
    private readonly getAuth = AppDataSource.getRepository(Auth),
    private readonly bcryptService = new BcryptService(),
    private readonly mailService = new EmailService()
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
      await this.mailService.sendMail({
        to: data.email,
        text:'Registered Successfully',
        subject:'Registered Successfully',
        html:generateHtml(`Hey ${details.first_name}! Welcome to the ConnectHub`)
      })
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
      console.log(user.password)
      if (!passwordMatched) {
        throw new Error('Incorrect Password')
      }

      const userid = await Auths.getById(user.id)
      console.log(userid, 'okok')
      // await this.mailService.sendMail({
      //   to: data.email,
      //   text:'Login Info',
      //   subject:'Login Info',
      //   html:generateHtml(`Someone has logged in to your account`)
      // })
      return await Auths.getById(user.id)
    } catch (error) {
      throw HttpException.notFound(Message.error)
    }
  }

  async googleLogin(googleId: string): Promise<any> {
    try {
      const decoded: any = jwtDecode(googleId)
      const user = await this.getAuth.findOne({
        where: { email: decoded.email },
        relations: ['details'],
      })
      if (!user) {
        try {
          const user = new Auth()
          user.email = decoded?.email
          user.username = decoded?.email
          user.password = await this.bcryptService.hash(decoded?.sub)

          const save = await this.getAuth.save(user)
          console.log('🚀 ~ AuthService ~ googleLogin ~ save:', save)
          if (save) {
            const details = new UserDetails()
            details.auth = save
            details.first_name = decoded.given_name
            details.middle_name = decoded?.middle_name
            details.last_name = decoded.family_name
            await this.getDetails.save(details)
            return await UserService.getById(save.id)
          }
        } catch (error) {
          throw HttpException.badRequest(Message.error)
        }
      }
    } catch (error) {
      console.log(error)
      
    }
  }

  async getEmail(data: any) {
    await this.mailService.sendMail({
      to: data?.email,
      text: 'Reset Password',
      subject: 'Reset Password',
      html: '<p>http://localhost:4000/user/updatePassword</p>',
    })
  }

  async passwordReset(userId: string, data: ResetPasswordDTO): Promise<string> {
    try {
      const users = await this.getAuth.findOneBy({id:userId})
      if(!users) throw HttpException.unauthorized(Message.notAuthorized)
      console.log("🚀 ~ AuthService ~ passwordReset ~ users:", users)
      
      const auth = await this.getAuth.findOne({ where: { id: userId }, select: ['id','password'] })
      if (!auth) throw HttpException.unauthorized
      if (!auth.password) throw HttpException.badRequest('No password')
      console.log('🚀 ~ AuthService ~ passwordReset ~ !auth:', auth.password)
    auth.password = await this.bcryptService.hash(data.password)
      console.log("yaa samma good xa");

      console.log("🚀 ~ AuthService ~ passwordReset ~ data.password:", data.password)
      await this.getAuth.update(auth.id, { password: auth.password });
      await this.mailService.sendMail({
        to: users.email,
        text:'Password Reset Successfully',
        subject:'Password Reset Successfully',
        html:'<p>Password changed Successfully!</p>'
      })
      return Message.passwordReset
    } catch (error) {
      console.log('🚀 ~ AuthService ~ passwordReset ~ error:', error)
      return Message.error
    }
  }
}

export default new AuthService()