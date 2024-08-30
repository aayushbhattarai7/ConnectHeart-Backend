import { Router } from 'express'
import { authorization } from '../middleware/authorization.middleware'
import wrapper from '@myrotvorets/express-async-middleware-wrapper'
import { Role } from '../constant/enum'
import { authentication } from '../middleware/authentication.middleware'
import { ChatController } from '../controllers/chat.controller'
const chat = new ChatController()
const router: Router = Router()

router.use(authentication())
router.use(authorization([Role.USER]))

router.post('/:id', wrapper(chat.sendChat))
router.get('/:id', wrapper(chat.displayChat))
router.get('/unread/:id', wrapper(chat.getUndreadChat))
router.patch('/read/:id', wrapper(chat.readChat))

export default router
