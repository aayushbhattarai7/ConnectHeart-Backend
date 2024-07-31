import { Router } from 'express'
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

// router.use(authentication())

// router.use(authorization([Role.USER]))

router.get('/:postId', wrapper(post.getPost))
router.get('/user/posts', post.getUserPost)
router.post('/', upload.array('files'), wrapper(post.create))
router.patch('/:id', upload.array('files'), wrapper(post.update))
router.delete('/:postId',wrapper(post.delete))
router.post('/comment/:postId', RequestValidator.validate(CommentDTO), wrapper(comment.comment))
router.post('/comment/:postId/:commentId', wrapper(comment.commentReply))
router.get('/comment/:id', wrapper(comment.getComments))
router.patch('/comment/:postId', wrapper(comment.updateComment))
router.delete('/comment/:commentId', wrapper(comment.deleteComment))

export default router