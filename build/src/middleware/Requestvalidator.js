"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const titleTOCase_1 = require("../utils/titleTOCase");
const getValidationMessage = (errors, message) => {
    errors.forEach((err) => {
        if (err.children && err.children?.length > 0) {
            getValidationMessage(err.children, message);
        }
        else {
            if (err.constraints) {
                Object.values(err.constraints).forEach((value) => {
                    const caseValue = (0, titleTOCase_1.titleNameToCase)(value);
                    message.push(caseValue);
                });
            }
        }
    });
};
class RequestValidator {
    static validate = (classInstance) => {
        return async (req, res, next) => {
            const convertedObject = (0, class_transformer_1.plainToClass)(classInstance, req.body);
            const validationMessages = [];
            const errors = await (0, class_validator_1.validate)(convertedObject, {
                whitelist: true,
                forbidNonWhitelisted: true,
            });
            //   if (errors.length !== 0) {
            //     getValidationMessage(errors, validationMessages)
            //     console.log('req error')
            //     next(HttpException.forbidden(validationMessages[0]))
            //   }
            next();
        };
    };
}
exports.default = RequestValidator;
