import { type Request, type Response } from 'express'
import { Message } from '../constant/message'
import { StatusCodes } from '../constant/StatusCodes'
import authService from '../services/auth.services'
import { AuthDTO } from '../dto/user.dto'

export class AuthController {
   async create(req:Request, res:Response) {
   console.log("🚀 ~ AuthController ~ req:", req.body)
  
      await authService.create(req.body as AuthDTO)
      res.status(StatusCodes.CREATED).render('login')
   
       
   }
  
   async login(req: Request, res:Response){
      const data = await authService.login(req.body);
      console.log(data)
      // const tokens = webTokenService.generateTokens({id:data.id})
      // res.status(StatusCodes.SUCCESS).render('index',{
      //    data:{
      //       id: data.id,
      //       email:data.email,
      //       username: data.username,
      //       details:{
      //          first_name:data.details.first_name,
      //          middle_name:data.details.middle_name,
      //          last_name: data.details.last_name,
      //          phone_number: data.details.phone_number,
      //       }
      //       ,tokens:{
      //       accessToken: tokens.accessToken,
      //       refreshToken: tokens.refreshToken
            
      //    },
      //    message:Message.loginSuccessfully

         
      // }
      

      // })
   }

}
