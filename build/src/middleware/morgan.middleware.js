"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = void 0;
const morgan_1 = __importDefault(require("morgan"));
const logger_config_1 = require("../config/logger.config");
const env_config_1 = require("../config/env.config");
const enum_1 = require("../constant/enum");
const stream = {
    write: (message) => logger_config_1.Logger.http(message),
};
const skip = () => {
    const env = env_config_1.DotenvConfig.NODE_ENV ?? enum_1.Environment.DEVELOPMENT;
    return env !== enum_1.Environment.DEVELOPMENT;
};
exports.morganMiddleware = (0, morgan_1.default)(':method:url : status: :res[content-length] - :response-time ms', {
    stream,
    skip
});
