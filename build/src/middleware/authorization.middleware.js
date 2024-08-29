"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const message_1 = require("../constant/message");
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
const authorization = (roles) => {
    return (req, res, next) => {
        if (!req.user)
            throw HttpException_utils_1.default.unauthorized(message_1.Message.notAuthorized);
        try {
            const userRole = req.user.role;
            if (userRole && roles.includes(userRole))
                next();
            else
                throw HttpException_utils_1.default.unauthorized(message_1.Message.notAuthorized);
        }
        catch (error) {
            throw HttpException_utils_1.default.unauthorized(message_1.Message.notAuthorized);
        }
    };
};
exports.authorization = authorization;
