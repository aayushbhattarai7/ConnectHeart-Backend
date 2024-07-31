import { Router, type Request, type Response } from "express";
import { AuthController } from '../controllers/auth.controller';
import { catchAsync } from '../utils/catchAsync.utils';
import RequestValidator from '../middleware/Requestvalidator';
import { AuthDTO, GoogleLoginDTO, UpdateDTO } from '../dto/user.dto';
import { authorization } from "../middleware/authorization.middleware";
import wrapper from '@myrotvorets/express-async-middleware-wrapper';
import { StatusCodes } from '../constant/StatusCodes';
import { Role } from "../constant/enum";
import { authentication } from "../middleware/authentication.middleware";

const router: Router = Router();
const authController = new AuthController();

router.post('/signup', RequestValidator.validate(AuthDTO),catchAsync(authController.create));
router.get('/signup', (_, res: Response) => {
    res.render('signup');
});

router.get('/login', (_, res: Response) => {
    res.status(StatusCodes.SUCCESS).render('login');
});
router.post('/login', wrapper(authController.login));

router.post('/google', wrapper(authController.googleLogin))

router.get('/getit/:id', authController.getId)


router.use(authentication())

router.use(authorization([Role.USER]))
router.post('/get',authController.getEmail)
router.get('/updatePassword',(_, res) =>res.status(StatusCodes.SUCCESS).render('password'))
router.patch('/updatePassword', catchAsync(authController.resetPassword))

router.patch('/update', RequestValidator.validate(UpdateDTO),catchAsync(authController.update))


router.get('/search', wrapper(authController.searchUser))
export default router;
