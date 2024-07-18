import { Router, type Request, type Response } from "express";
import { AuthController } from '../controllers/auth.controller';
import { catchAsync } from '../utils/catchAsync.utils';
import RequestValidator from '../middleware/Requestvalidator';
import { AuthDTO, UpdateDTO } from '../dto/user.dto';
import { authorization } from "../middleware/authorization.middleware";
import wrapper from '@myrotvorets/express-async-middleware-wrapper';
import { StatusCodes } from '../constant/StatusCodes';
import { Role } from "../constant/enum";
import { authentication } from "../middleware/authentication.middleware";

const router: Router = Router();
const authController = new AuthController();

router.post('/signup', RequestValidator.validate(AuthDTO), catchAsync(authController.create));
router.get('/signup', (_, res: Response) => {
    res.render('signup');
});

router.get('/login', (_, res: Response) => {
    res.status(StatusCodes.SUCCESS).render('login');
});
router.post('/login', wrapper(authController.login));
router.use(authentication())

router.use(authorization([Role.USER]))

router.patch('/update', RequestValidator.validate(UpdateDTO),catchAsync(authController.update))

export default router;
