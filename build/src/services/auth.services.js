"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_config_1 = require("../config/database.config");
const details_entities_1 = require("../entities/auth/details.entities");
const message_1 = require("../constant/message");
const auth_entity_1 = require("../entities/auth/auth.entity");
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
const bcrypt_utils_1 = __importDefault(require("../utils/bcrypt.utils"));
const user_service_1 = __importDefault(require("./user.service"));
class AuthService {
    getDet;
    getDetails;
    bcryptService;
    constructor(getDet = database_config_1.AppDataSource.getRepository(details_entities_1.userDetails), getDetails = database_config_1.AppDataSource.getRepository(auth_entity_1.Auth), bcryptService = new bcrypt_utils_1.default()) {
        this.getDet = getDet;
        this.getDetails = getDetails;
        this.bcryptService = bcryptService;
    }
    async create(data) {
        const user = new details_entities_1.userDetails();
        user.first_name = data.first_name;
        user.middle_name = data.middle_name;
        user.last_name = data.last_name;
        user.phone_number = data.phone_number;
        const auth = new auth_entity_1.Auth();
        auth.email = data.email;
        auth.username = data.username;
        auth.password = await this.bcryptService.hash(data.password);
        user.auth = auth;
        await auth.save();
        await user.save();
        console.log('User details saved successfully');
        return message_1.Message.created;
    }
    async login(data) {
        try {
            const user = await this.getDetails.findOne({
                where: [{ email: data.email }],
                select: ['id', 'email', 'password'],
            });
            if (!user)
                throw HttpException_utils_1.default.notFound(message_1.Message.invalidCredentials);
            const passwordMatched = await this.bcryptService.compare(data.password, user.password);
            if (!passwordMatched) {
                throw new Error('aayush vai pada');
            }
            return await user_service_1.default.getById(user.id);
        }
        catch (error) {
            throw HttpException_utils_1.default.notFound(message_1.Message.invalidCredentials);
            // throw HttpException.badRequest("Login Failed")
            // throw new Error("Error occurred")
        }
    }
}
exports.default = new AuthService();
