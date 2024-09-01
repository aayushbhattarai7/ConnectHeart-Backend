import { Router } from 'express'
import RequestValidator from '../middleware/Requestvalidator'
import { authorization } from '../middleware/authorization.middleware'
import wrapper from '@myrotvorets/express-async-middleware-wrapper'
import { LikeController } from '../controllers/like.controller'
import { Role } from '../constant/enum'
import { authentication } from '../middleware/authentication.middleware'
import { catchAsync } from '../utils/catchAsync.utils'
const like = new LikeController()
const router: Router = Router()

router.use(authentication())

router.use(authorization([Role.USER]))

router.post('/:postId', like.changeLike)
router.get('/:postId', like.likeCount)
router.get('/like/:postId', like.postLike)
router.get('/', catchAsync(like.userLike))
export default router
