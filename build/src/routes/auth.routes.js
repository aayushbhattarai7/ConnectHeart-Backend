"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const Requestvalidator_1 = __importDefault(require("../middleware/Requestvalidator"));
const user_dto_1 = require("../dto/user.dto");
const express_async_middleware_wrapper_1 = __importDefault(require("@myrotvorets/express-async-middleware-wrapper"));
const StatusCodes_1 = require("../constant/StatusCodes");
const media_controller_1 = __importDefault(require("../controllers/media.controller"));
const fileUpload_1 = __importDefault(require("../utils/fileUpload"));
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controllers_1.AuthController();
router.post('/signup', Requestvalidator_1.default.validate(user_dto_1.AuthDTO), (0, catchAsync_utils_1.catchAsync)(authController.create));
router.get('/signup', (_, res) => {
    res.render('signup');
});
router.get('/login', (_, res) => {
    res.status(StatusCodes_1.StatusCodes.SUCCESS).render('login');
});
router.use((0, authentication_middleware_1.authentication)());
router.patch('/update', Requestvalidator_1.default.validate(user_dto_1.UpdateDTO), (0, catchAsync_utils_1.catchAsync)(authController.update));
router.post('/login', (0, express_async_middleware_wrapper_1.default)(authController.login));
// router.delete('/:id', authController.delete)
// router.use(authorization([Role.USER]))
router.get('/', (req, res) => {
    res.render('index');
});
router.get('/get/:id', authController.getId);
router.post('/', fileUpload_1.default.array('file'), (0, catchAsync_utils_1.catchAsync)(media_controller_1.default.create));
exports.default = router;
