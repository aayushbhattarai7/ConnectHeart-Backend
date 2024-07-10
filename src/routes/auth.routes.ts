import type { Router as IRouter } from 'express'
import Router from 'express'
import express, { NextFunction, Request, Response, type Application } from 'express';
import { AuthController } from '../controllers/auth.controllers'
import { catchAsync } from '../utils/catchAsync.utils'
import RequestValidator from '../middleware/Requestvalidator'
import { AuthDTO } from '../dto/user.dto'
import wrapper from '@myrotvorets/express-async-middleware-wrapper';
import { StatusCodes } from '../constant/StatusCodes'
import mediaController from '../controllers/media.controller';
import upload from '../utils/fileUpload';
const router:IRouter = Router()
const authController = new AuthController()


router.post('/signup',RequestValidator.validate(AuthDTO), catchAsync(authController.create))
router.get('/signup',(_, res:Response)=>{
    res.render('signup')
})

router.get('/login',(_, res:Response) =>{
    res.status(StatusCodes.SUCCESS).render('login')
})
router.post('/login', wrapper(authController.login))
export default router

router.post('/',upload.array('file'), catchAsync(mediaController.create))
//