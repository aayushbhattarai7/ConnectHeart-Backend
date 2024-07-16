"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const message_1 = require("../constant/message");
const StatusCodes_1 = require("../constant/StatusCodes");
const auth_services_1 = __importDefault(require("../services/auth.services"));
const webToken_service_1 = __importDefault(require("../utils/webToken.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
class AuthController {
    async create(req, res) {
        console.log("🚀 ~ AuthController ~ req:", req.body);
        await auth_services_1.default.create(req.body);
        res.status(StatusCodes_1.StatusCodes.CREATED).json(message_1.Message.created);
    }
    async login(req, res) {
        const data = await auth_services_1.default.login(req.body);
        console.log('uusserrr', data);
        const tokens = webToken_service_1.default.generateTokens({
            id: data.id,
        }, data.role);
        res.status(StatusCodes_1.StatusCodes.SUCCESS).json({
            data: {
                id: data.id,
                email: data.email,
                username: data.username,
                details: {
                    first_name: data.details.first_name,
                    middle_name: data.details.middle_name,
                    last_name: data.details.last_name,
                    phone_number: data.details.phone_number,
                },
                tokens: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
                message: message_1.Message.loginSuccessfully,
            },
        });
    }
    async update(req, res) {
        const userId = req.params.id;
        console.log(userId, "controller");
        const body = req.body;
        await user_service_1.default.update(body, userId);
        res.status(StatusCodes_1.StatusCodes.CREATED).json(message_1.Message.created);
    }
    // async delete(req:Request, res:Response) {
    //   const userId = req.params.id;
    //   console.log(userId)
    //   const message = await userService.delete(userId);
    //   res.status(200).json(message);
    // }
    async getId(req, res) {
        const id = req.user?.id;
        console.log(id);
        const data = await user_service_1.default.getById(id);
        console.log(data);
        res.status(StatusCodes_1.StatusCodes.SUCCESS).json({
            status: true,
            data,
            message: message_1.Message.created,
        });
    }
}
exports.AuthController = AuthController;
