"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const env_config_1 = require("../config/env.config");
const message_1 = require("../constant/message");
const errorHandler = (error, req, res, next) => {
    console.log("🚀 ~ errorHandler ~ error:", error);
    let statusCode = 500;
    let data = {
        success: false,
        message: message_1.Message.error,
        ...(env_config_1.DotenvConfig.DEBUG_MODE === 'true' && { original: error.message }),
    };
    if (error?.isOperational || error?.isCustom) {
        statusCode = error.statusCode;
        data = {
            ...data,
            message: error.message,
        };
    }
    return res.status(statusCode).json(data);
};
exports.errorHandler = errorHandler;
