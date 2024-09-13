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
import Profile from '../entities/auth/profile.entity'
import { Gender } from '../constant/enum'
import { transferImageFromUploadToTemp } from '../utils/path.utils'
import { emailRegex, passwordRegex } from '../utils/regex'
import { OtpService } from './otp.service'
import { HashService } from './utils/hash.service'
class AuthService {
  constructor(
    private readonly getDetails = AppDataSource.getRepository(UserDetails),
    private readonly getAuth = AppDataSource.getRepository(Auth),
    private readonly getMediaRepo = AppDataSource.getRepository(Profile),
    private readonly bcryptService = new BcryptService(),
    private readonly mailService = new EmailService(),
    private readonly otpService = new OtpService(),
    private readonly hashService = new HashService()
  ) {}

  async create(image: any, data: AuthDTO): Promise<Auth> {
    try {
      const emailExist = await this.getAuth.findOne({
        where: {
          email: data.email,
        },
      })

      if (emailExist) throw HttpException.badRequest('Entered email is already registered')
      if (!data.email || !data.first_name || !data.last_name)
        throw HttpException.badRequest('Please fill all the required fields ')

      if (!emailRegex.test(data.email)) {
        throw HttpException.badRequest('Please enter valid email')
      }
      if (!passwordRegex.test(data.password)) {
        throw HttpException.badRequest('Password requires an uppercase, digit, and special char.')

      }
   

      const auth = this.getAuth.create({
        email: data.email,
        password: await this.bcryptService.hash(data.password),
      })
      await this.getAuth.save(auth)

      const details = this.getDetails.create({
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        gender: Gender[data.gender as keyof typeof Gender],
        auth: auth,
      })
      await this.getDetails.save(details)
      let profilepic = null
      if (image) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']

        if (allowedMimeTypes.includes(image?.mimetype)) {
          profilepic = this.getMediaRepo.create({
            name: image?.name,
            mimetype: image?.mimetype,
            type: image?.type,
            auth: auth,
          })
          const saveProfile = await this.getMediaRepo?.save(profilepic)
          saveProfile?.transferProfileToUpload(auth.id, saveProfile.type)
        } else {
          throw HttpException.badRequest('Invalid file type. Only jpg, jpeg, and png are accepted.')
        }
      }

      await this.mailService.sendMail({
        to: data.email,
        text: 'Registered Successfully',
        subject: 'Registered Successfully',
        html: generateHtml(`Hey ${details.first_name}! Welcome to the ConnectHub`),
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
        select: ['id', 'email', 'password', 'deletedAt'],
      })
      if (!user) throw HttpException.notFound('Please Enter a valid email')
      await this.getAuth.update({ id: user.id }, { deletedAt: null })
      const passwordMatched = await this.bcryptService.compare(data.password, user.password)
      if (!passwordMatched) {
        throw new Error('Incorrect Password')
      }

      const userid = await Auths.getById(user.id)
      await this.mailService.sendMail({
        to: data.email,
        text: 'Login Info',
        subject: 'Login Info',
        html: generateHtml(`Someone has logged in to your account`),
      })
      return await Auths.getById(user.id)
    } catch (error: any) {
      throw HttpException.notFound(error.message)
    }
  }

  async googleLogin(googleId: string): Promise<any> {
    const decoded: any = jwtDecode(googleId)
    try {
      const decoded: any = jwtDecode(googleId)
      const user = await this.getAuth.findOne({
        where: { email: decoded.email },
      })
      if (!user) {
        try {
          const user = new Auth()
          user.email = decoded?.email
          user.password = await this.bcryptService.hash(decoded?.sub)
          const save = await this.getAuth.save(user)
          if (save) {
            const details = new UserDetails()
            details.auth = save
            details.first_name = decoded.given_name

            details.last_name = decoded.family_name
            details.gender = Gender.NULL

            await this.getDetails.save(details)
            return await UserService.getById(save?.id)
          }
        } catch (error: any) {
          throw HttpException.badRequest(error.message)
        }
      } else {
        return await UserService.getById(user?.id)
      }
    } catch (error: any) {
      console.log(error.message)
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

  async onActiveStatusOfUser(userId: string) {
    try {
      const auth = await this.getAuth.findOneBy({ id: userId })
      console.log(userId)
      if (!auth) throw HttpException.unauthorized

      const changeActiveStatus = await this.getAuth.update(userId, { active: true })

      return changeActiveStatus
    } catch (error) {
      console.log(error)
    }
  }

  async offActiveStatusOfUser(userId: string) {
    try {
      const auth = await this.getAuth.findOneBy({ id: userId })
      console.log(userId)
      if (!auth) throw HttpException.unauthorized

      const changeActiveStatus = await this.getAuth.update(userId, { active: false })

      return changeActiveStatus
    } catch (error) {
      console.log(error)
    }
  }

  async updatePassword(userId: string, data: ResetPasswordDTO): Promise<string> {
    try {
      const users = await this.getAuth.findOne({
        where: [{ id: userId }],
        select: ['id', 'password'],
      })
      if (!users) throw HttpException.unauthorized(Message.notAuthorized)
      const passwordMatched = await this.bcryptService.compare(data.oldPassword, users.password)
      if (!passwordMatched) {
        throw new Error('Password didnot matched')
      }
      if (!passwordRegex.test(data.password)) {
        throw HttpException.badRequest('Password requires an uppercase, digit, and special char.')
      }
      if (data.password !== data.confirmPassword) throw new Error('Password must be same in both fields')

      if (passwordMatched) {
        const auth = await this.getAuth.findOne({ where: { id: userId }, select: ['id', 'password'] })
        console.log(passwordMatched, 'ahha')
        if (!auth) throw HttpException.unauthorized
        if (!auth.password) throw HttpException.badRequest('No password')
        auth.password = await this.bcryptService.hash(data.password)
        await this.getAuth.update(auth.id, { password: auth.password })
        await this.mailService.sendMail({
          to: users.email,
          text: 'Password updated Successfully',
          subject: 'Password updated Successfully',
          html: '<p>Password updated Successfully!</p>',
        })
        return 'Password updated Successfully'
      } else {
        throw HttpException.badRequest('Invalid current password')
      }
    } catch (error: any) {
      console.log('🚀 ~ AuthService ~ passwordReset ~ error:', error)
      throw HttpException.notFound(error.message)
    }
  }

  async verifyEmail(email: string) {
    try {
      const user = await this.getAuth.findOneBy({ email })
      if (!user) throw HttpException.badRequest('Email is not registered')
      const otp = await this.otpService.generateOtp()
      const expires = Date.now() + 5 * 60 * 1000
      const payload = `${email}.${otp}.${expires}`
      const hashedOtp = this.hashService.hashOtp(payload)

      await this.getAuth.update({ email }, { otp: `${hashedOtp}.${expires}` })
      if (email) {
        await this.mailService.sendMail({
          to: email,
          text: 'Your OTP Code for Verification',
          subject: 'Password Reset Successfully',
          html: ` <div class="header">Your OTP Code</div>
        <div class="content">
            Hi there,
            <br><br>
            Here is your one-time password (OTP) for verification:
            <div class="otp">${otp}</div>
            <br>
            Please enter this code on the verification page. This OTP is valid for the next 10 minutes.
            <br><br>
            If you did not request this OTP, please disregard this email.
        </div>
        <div class="footer">
            Best regards,<br>
            Connect Heart
        </div>`,
        })
      }

      return
    } catch (error: any) {
      console.error('🚀 ~ AuthService ~ verifyEmail ~ error:', error.message)
      throw HttpException.badRequest(error.message)
    }
  }

  async verifyOtp(email: string, otp: string) {
    try {
      const user = await this.getAuth.findOneBy({ email })
      if (!user) throw HttpException.unauthorized('Invalid email')

      const [hashedOtp, expires] = user?.otp?.split('.')
      if (Date.now() > +expires) throw HttpException.badRequest(Message.otpExpired)

      const payload = `${email}.${otp}.${expires}`
      const isOtpValid = this.otpService.verifyOtp(hashedOtp, payload)
      if (!isOtpValid) throw HttpException.badRequest('Invalid OTP')

      return true
    } catch (error: any) {
      console.error('🚀 ~ AuthService ~ verifyOtp ~ error:', error.message)
      throw HttpException.badRequest(error.message)
    }
  }

  async resetPassword(email: string, password: string, confirmPassword: string) {
    try {
       if (!passwordRegex.test(password)) {
        throw HttpException.badRequest('Password requires an uppercase, digit, and special char.')
      }
      if (password !== confirmPassword) throw HttpException.badRequest('Password should be matched in both fields')
      const hashedPassword = await this.bcryptService.hash(password)
      await this.getAuth.update({ email }, { password: hashedPassword })
    } catch (error: any) {
      console.error('🚀 ~ AuthService ~ resetPassword ~ error:', error.message)
      throw HttpException.badRequest(error.message)
    }
  }
  async getUser(userId: string) {
    try {
      const auth = await this.getAuth.findOneBy({ id: userId })
      if (!auth) throw HttpException.notFound

      const users = await this.getAuth
        .createQueryBuilder('auth')
        .leftJoinAndSelect('auth.details', 'details')
        .leftJoinAndSelect('auth.profile', 'profile')
        .where('auth.id =:userId', { userId })
        .getOne()
      return users
    } catch (error) {
      console.log('🚀 ~ AuthService ~ getUser ~ error:', error)
      throw HttpException.notFound
    }
  }

  async getUserProfile(userId: string, friendId: string) {
    try {
      const auth = await this.getAuth.findOneBy({ id: userId })
      if (!auth) throw HttpException.unauthorized('You are not authorized')

      const userProfile = await this.getAuth
        .createQueryBuilder('auth')
        .leftJoinAndSelect('auth.details', 'details')
        .leftJoinAndSelect('auth.profile', 'profile')
        .leftJoinAndSelect('auth.posts', 'posts')
        .leftJoinAndSelect('posts.postImage', 'postImage')
        .where('auth.id =:friendId', { friendId })
        .getMany()

      return userProfile
    } catch (error: any) {
      console.log(error?.message)
      throw HttpException.badRequest('Error while fetching user post')
    }
  }

  async updateUser(userId: string, image: any, data: AuthDTO): Promise<Auth> {
    try {
      const auth = await this.getAuth.findOne({
        where: { id: userId },
        relations: ['details'],
      })
      if (!auth) throw HttpException.unauthorized('You are not authorized')
      auth.email = data?.email || auth.email
      auth.details.first_name = data?.first_name || auth.details.first_name
      auth.details.last_name = data?.last_name || auth.details.last_name
      auth.details.phone_number = data?.phone_number || auth.details.phone_number

      const saveAuth = await this.getAuth.save(auth)
      await this.getDetails.save(auth.details)

      if (image) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']

        if (!allowedMimeTypes.includes(image?.mimetype)) {
          throw HttpException.badRequest('Invalid file type. Only jpg, jpeg, and png are accepted.')
        }

        const media = await this.getMediaRepo.findOne({
          where: { auth: { id: userId } },
        })

        if (media) {
          transferImageFromUploadToTemp(media.id, media.name, media.type)

          await this.getMediaRepo
            .createQueryBuilder()
            .delete()
            .from(Profile)
            .where('auth.id = :userId', { userId })
            .execute()
        }

        const profilepic = this.getMediaRepo.create({
          name: image?.name,
          mimetype: image?.mimetype,
          type: image?.type,
          auth: saveAuth,
        })
        const savedProfile = await this.getMediaRepo.save(profilepic)

        savedProfile.transferProfileToUpload(auth.id, savedProfile.type)
      }

      return auth
    } catch (error: any) {
      console.log('🚀  error:', error?.message)
      throw HttpException.badRequest(error?.message)
    }
  }

  async deleteUser(userId: string) {
    try {
      const auth = await this.getAuth.findOneBy({ id: userId })
      if (!auth) throw HttpException.unauthorized(Message.notAuthorized)

      const deleteDate = new Date()
      deleteDate.setDate(deleteDate.getDate() + 10)
      await this.getAuth
        .createQueryBuilder('auth')
        .update(Auth)
        .set({ deletedAt: deleteDate })
        .where('auth.id = :userId', { userId })
        .execute()
    } catch (error: any) {
      throw HttpException.badRequest(error.message)
    }
  }

  async deleteAccounts() {
    try {
      const result = await this.getAuth.createQueryBuilder().delete().where('deleted_at < NOW()').execute()

      return result
    } catch (error: any) {
      throw HttpException.badRequest(error.message)
    }
  }
}

export default new AuthService()
