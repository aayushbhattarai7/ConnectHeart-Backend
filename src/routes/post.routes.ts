import { Router, type Request, type Response } from "express";
import { catchAsync } from '../utils/catchAsync.utils';
import RequestValidator from '../middleware/Requestvalidator';
import { authorization } from "../middleware/authorization.middleware";
import wrapper from '@myrotvorets/express-async-middleware-wrapper';
import { StatusCodes } from '../constant/StatusCodes';
import mediaController from '../controllers/media.controller';
import upload from '../utils/fileUpload';
import { postDTO } from "../dto/post.dto";
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
router.post('/', upload.array('files'),post.create)
  router.patch('/',post.update)

router.delete('/:id', catchAsync(post.delete))
export default router;
