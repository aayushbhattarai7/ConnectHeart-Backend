import {  type Request, type Response } from "express"
import LikeService from "../services/utils/like.service"
import { LikeDTO } from "../dto/like.dto"
import { StatusCodes } from "../constant/StatusCodes"
import { Message } from "../constant/message"
const like = new LikeService()
export class LikeController {
    async like(req:Request, res:Response) {
        const body = req.body
        console.log(body);
        try {
            const userId = req?.user?.id
            const postId = req?.params?.id
            const likes = await like.like(userId as string, postId)
            console.log("🚀 ~ LikeController ~ like ~ likes:", likes)
            
            res.status(StatusCodes.SUCCESS).json({
                likes,
                Message:Message.success
            })
        } catch (error:any) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message:Message.error
            })
            console.log("🚀 ~ LikeController ~ like ~ error:", error)
            
        }
    }

    async dislike(req:Request, res:Response) {
       console.log("yaa samma ok");
       
        try {
            const userId = req?.user?.id
            console.log("🚀 ~ LikeController ~ dislike ~ userId:", userId)
            const postId = req?.params?.postId
            console.log("🚀 ~ LikeController ~ dislike ~ likeId:", postId)
           
            
            const likes = await like.dislike(userId as string, postId)
            
            res.status(StatusCodes.SUCCESS).json({
                likes,
                Message:Message.success
            })
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message:Message.error
            })
            console.log("🚀 ~ error is here:", error)
            
        }
    }

    async changeLike(req:Request, res:Response) {
        try {
            const userId = req?.user?.id
            const postId = req?.params?.postId
            const likes = await like.changeLike(userId as string, postId)
            console.log('jadhui')
            res.status(StatusCodes.SUCCESS).json({
                likes,
                Message:Message.success
            })
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message:Message.error
            })
            console.log("🚀 ~ LikeController ~ like ~ error:", error)
            
        }
    }
}


