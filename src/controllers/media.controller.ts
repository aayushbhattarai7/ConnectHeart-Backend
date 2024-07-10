import {type Request, type Response} from 'express'
import {StatusCodes} from '../constant/StatusCodes'
import { Message } from '../constant/message'
import AppError from '../utils/HttpException.utils'

class MediaController {
    async create(req:Request, res:Response){

        if(req?.files?.length ===0) throw AppError.badRequest('Sorry file couldnot be uploaded') 
            const fileArray = req.files as Express.Multer.File[]   
        const data = fileArray.map((file: any) => {
            return{
            name:file?.fileName,
            mimeType:file?.mimeType,
            type:req.body?.type,
            }
            })
            res.status(StatusCodes.CREATED).json({
                status: true,
                message:Message.created,
                data           })
    }
}

export default new MediaController()