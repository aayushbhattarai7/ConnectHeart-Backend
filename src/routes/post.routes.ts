import { Router, type Request, type Response } from "express";
import { catchAsync } from '../utils/catchAsync.utils';
import RequestValidator from '../middleware/Requestvalidator';
import { authorization } from "../middleware/authorization.middleware";
import wrapper from '@myrotvorets/express-async-middleware-wrapper';
import upload from '../utils/fileUpload';
import { PostDTO } from "../dto/post.dto";
import { Role } from "../constant/enum";
import { authentication } from "../middleware/authentication.middleware";
import {PostController}  from "../controllers/posts.controller";
const post = new PostController()
const router:Router = Router()

router.use(authentication())

router.use(authorization([Role.USER]))
router.get('/', (req:Request, res:Response) => {
    res.render('upload')
})
router.post('/', RequestValidator.validate(PostDTO), upload.array('files'),wrapper(post.create))
  router.patch('/:id',wrapper(post.update))

  router.get('/posts', wrapper(post.getPost))

export default router;
