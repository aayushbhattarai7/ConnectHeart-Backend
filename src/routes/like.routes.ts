import { Router } from 'express'
import RequestValidator from '../middleware/Requestvalidator'
import { authorization } from '../middleware/authorization.middleware'
import wrapper from '@myrotvorets/express-async-middleware-wrapper'
import { LikeController } from "../controllers/like.controller";
import { Role } from '../constant/enum'
import { authentication } from '../middleware/authentication.middleware'
const like = new LikeController()
const router:Router = Router()

router.use(authentication())

router.use(authorization([Role.USER]))

router.post('/:postId', like.changeLike)

export default router