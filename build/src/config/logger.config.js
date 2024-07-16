"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = __importDefault(require("winston"));
const enum_1 = require("../constant/enum");
const env_config_1 = require("./env.config");
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const level = () => {
    const env = env_config_1.DotenvConfig.NODE_ENV ?? enum_1.Environment.DEVELOPMENT;
    const isDevelopment = env === enum_1.Environment.DEVELOPMENT;
    return isDevelopment ? 'debug' : 'warn';
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magneta',
    debug: 'blue'
};
winston_1.default.addColors(colors);
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp}) ${info.level}: ${info.message}`));
const transports = [
    new winston_1.default.transports.Console(),
    new winston_1.default.transports.File({
        filename: 'log/error.log',
        level: 'error'
    }),
    new winston_1.default.transports.File({ filename: 'log/all.log' }),
];
exports.Logger = winston_1.default.createLogger({
    level: level(),
    levels,
    format,
    transports
});
