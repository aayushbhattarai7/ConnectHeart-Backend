import { type Request, type Response } from 'express'
import { Message } from '../constant/message'
import { StatusCodes } from '../constant/StatusCodes'
import authService from '../services/user.service'
import { AuthDTO } from '../dto/user.dto'
import webTokenService from '../utils/webToken.service'
import userService from '../services/auth.service'

export class AuthController {
  async create(req: Request, res: Response) {
    console.log('🚀 ~ AuthController ~ req:', req.body)

    await authService.create(req.body as AuthDTO)
    res.status(StatusCodes.CREATED).json({ message: Message.created })
  }

  async login(req: Request, res: Response) {
    const data = await authService.login(req.body)
    const tokens = webTokenService.generateTokens(
      {
        id: data.id,
      },
      data.role
    )
    res.cookie('token', tokens, { httpOnly: true })

    res.status(StatusCodes.SUCCESS).json({
      data: {
        id: data.id,
        email: data.email,
        username: data.username,
        details: {
          first_name: data.details.first_name,
          middle_name: data.details.middle_name,
          last_name: data.details.last_name,
          phone_number: data.details.phone_number,
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        message: Message.loginSuccessfully,
      },
    })
  }
  async update(req: Request, res: Response) {
    const userId = req.params.id
    console.log(userId, 'controller')
    const body = req.body
    await userService.update(body, userId)
    res.status(StatusCodes.CREATED).json(Message.created)
  }

  async getId(req: Request, res: Response) {
    const id = req.user?.id
    console.log(id)
    const data = await userService.getById(id as string)
    console.log(data)
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      data,
      message: Message.created,
    })
  }
}
