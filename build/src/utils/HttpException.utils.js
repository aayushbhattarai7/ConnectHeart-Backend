"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatusCodes_1 = require("../constant/StatusCodes");
class HttpException extends Error {
    statusCode;
    isCustom;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isCustom = true;
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message) {
        return new HttpException(message, StatusCodes_1.StatusCodes.BAD_REQUEST);
    }
    static unauthorized(message) {
        return new HttpException(message, StatusCodes_1.StatusCodes.UNAUTHORIZED);
    }
    static notFound(message) {
        return new HttpException(message, StatusCodes_1.StatusCodes.NOT_FOUND);
    }
    static conflict(message) {
        return new HttpException(message, StatusCodes_1.StatusCodes.CONFLICT);
    }
    static forbidden(message) {
        return new HttpException(message, StatusCodes_1.StatusCodes.FORBIDDEN);
    }
    static internalServerError(message) {
        return new HttpException(message, StatusCodes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
exports.default = HttpException;
