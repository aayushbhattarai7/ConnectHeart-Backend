import { type Request, type Response } from 'express'
import { StatusCodes } from '../constant/StatusCodes'
import { Message } from '../constant/message'
import HttpException from '../utils/HttpException.utils'

class MediaController {
  async create(req: Request, res: Response) {
    if (req?.files?.length === 0) throw HttpException.badRequest(Message.uploadFailed)
    const data = req?.files?.map((file: any) => {
      return {
        mimeType: file?.mimeType,
        type: req.body?.type,
      }
    })
    console.log(data)
    res.status(StatusCodes.CREATED).json({
      status: true,
      message: Message.created,
      data,
    })
  }
}

export default new MediaController()
