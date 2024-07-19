import { Router} from 'express'
import RequestValidator from '../middleware/Requestvalidator'
import { authorization } from '../middleware/authorization.middleware'
import wrapper from '@myrotvorets/express-async-middleware-wrapper'
import upload from '../utils/fileUpload'
import { PostDTO } from '../dto/post.dto'
import { Role } from '../constant/enum'
import { authentication } from '../middleware/authentication.middleware'
import { PostController } from '../controllers/posts.controller'
import { CommentController } from '../controllers/comment.controller'
import { CommentDTO } from '../dto/comment.dto'
const post = new PostController()
const comment = new CommentController()
const router: Router = Router()

router.use(authentication())

router.use(authorization([Role.USER]))

router.get('/:postId', wrapper(post.getPost))
router.get('/user/posts', post.getUserPost)
router.post('/comment/:id', RequestValidator.validate(CommentDTO), wrapper(comment.comment))
router.get('/comment/:id', wrapper(comment.getComments))
router.post('/', upload.array('files'), wrapper(post.create))
router.patch('/:id', wrapper(post.update))
router.patch(':/postId/:imageId', upload.single('files'), wrapper(post.updateImage))

export default router
