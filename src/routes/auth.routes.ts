import { Router, type Response } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { catchAsync } from '../utils/catchAsync.utils'
import { authorization } from '../middleware/authorization.middleware'
import wrapper from '@myrotvorets/express-async-middleware-wrapper'
import { StatusCodes } from '../constant/StatusCodes'
import { Role } from '../constant/enum'
import { authentication } from '../middleware/authentication.middleware'
import upload from '../utils/fileUpload'

const router: Router = Router()
const authController = new AuthController()

router.post('/signup', upload.single('profile'), catchAsync(authController.create))
router.get('/signup', (_, res: Response) => {
  res.render('signup')
})

router.get('/login', (_, res: Response) => {
  res.status(StatusCodes.SUCCESS).render('login')
})
router.post('/login', wrapper(authController.login))

router.post('/google', wrapper(authController.googleLogin))

router.get('/getit/:id', authController.getId)

router.patch('/verify', authController.verifyEmail)
router.post('/verifyOTP', authController.verifyOtp)
router.patch('/resetpassword', authController.resetPassword)
router.use(authentication())
router.get('/search', wrapper(authController.searchUser))

router.use(authorization([Role.USER]))
router.post('/get', authController.getEmail)
router.get('/updatePassword', (_, res) => res.status(StatusCodes.SUCCESS).render('password'))
router.patch('/updatePassword', catchAsync(authController.updatePassword))

router.patch('/update', upload.single('profile'), catchAsync(authController.updateUser))
router.patch('/active', authController.changeStatus)
router.get('/userProfile/:id', wrapper(authController.getUserProfile))
router.get('/user', authController.getUser)
router.patch('/delete', authController.deleteUser)
export default router
