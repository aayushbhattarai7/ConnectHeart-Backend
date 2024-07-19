import {type Request, type Response} from 'express'
import { Message } from '../constant/message'
import { StatusCodes } from '../constant/StatusCodes'
import { ConnectService } from '../services/connect.service'
const Connect = new ConnectService()
export class ConnectController {
    async connect(req:Request, res:Response) {
        try{const sender = req.user?.id
        const receiver = req.params.id
        const send = await Connect.connect(sender as string,receiver)
        res.status(StatusCodes.SUCCESS).json({
            send,
            message:Message.success
        })}catch(error){
            console.log(error)
            res.status(StatusCodes.BAD_REQUEST).json({
                message:Message.error
            })
        }
    }
}