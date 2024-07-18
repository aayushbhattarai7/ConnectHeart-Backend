import { type NextFunction, type Request, type Response } from 'express'
import { type Role } from '../constant/enum'
import { Message } from '../constant/message'
import HttpException from '../utils/HttpException.utils'

export const authorization = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw HttpException.unauthorized(Message.notAuthorized)
    try {
      const userRole = req.user.role
      if (userRole && roles.includes(userRole as Role)) next()
      else throw HttpException.unauthorized(Message.notAuthorized)
    } catch (error) {
      throw HttpException.unauthorized(Message.notAuthorized)
    }
  }
}
