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
class UserService {
    getDet;
    getDetails;
    constructor(getDet = database_config_1.AppDataSource.getRepository(details_entities_1.userDetails), getDetails = database_config_1.AppDataSource.getRepository(auth_entity_1.Auth)) {
        this.getDet = getDet;
        this.getDetails = getDetails;
    }
    async getById(id, details = true) {
        try {
            const query = this.getDetails.createQueryBuilder('auth').where('auth.id = :id', { id });
            if (details)
                query.leftJoinAndSelect('auth.details', 'details');
            const users = await query.getOne();
            if (!users) {
                throw new HttpException_utils_1.default('User not found', 404);
            }
            console.log(users);
            return users;
        }
        catch (error) {
            console.error('Error:', error);
            throw new HttpException_utils_1.default('Internal server error', 500);
        }
    }
    async update(body, userId) {
        try {
            const id = userId;
            console.log(userId);
            const user = await this.getById(id);
            user.details.first_name = body.first_name,
                user.details.middle_name = body.middle_name,
                user.details.last_name = body.last_name,
                user.details.phone_number = body.phone_number,
                user.email = body.email,
                user.username = body.username,
                await this.getDet.save(user.details);
            await this.getDetails.save(user);
            await this.getById(user.id);
            return message_1.Message.updated;
        }
        catch (error) {
            console.log(error, 'error in update');
            return message_1.Message.error;
        }
    }
}
exports.default = new UserService();
