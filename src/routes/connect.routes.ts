import { Router } from 'express'
import RequestValidator from '../middleware/Requestvalidator'
import { authorization } from '../middleware/authorization.middleware'
import wrapper from '@myrotvorets/express-async-middleware-wrapper'
import { Role } from '../constant/enum'
import { authentication } from '../middleware/authentication.middleware'
import { ConnectController } from '../controllers/connect.controller'

const connectController = new ConnectController()
const router: Router = Router()

router.use(authentication())

router.use(authorization([Role.USER]))

router.post('/:id', wrapper(connectController.connect))
router.get('/requests', wrapper(connectController.viewRequest))
router.patch('/accept/:id', wrapper(connectController.accept))
router.delete('/reject/:id', wrapper(connectController.reject))
router.get('/friends', wrapper(connectController.friend))
router.get('/count', wrapper(connectController.getCount))
router.get('/suggestion', wrapper(connectController.getUserSuggestion))
router.delete('/remove/:id', wrapper(connectController.removeConnection))
router.patch('/block/:id', wrapper(connectController.chanageBlockStatus))
router.get('/block/:id', wrapper(connectController.getBlockedStatus))
export default router
