"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const env_config_1 = require("../config/env.config");
const enum_1 = require("../constant/enum");
const HttpException_utils_1 = __importDefault(require("./HttpException.utils"));
const storage = multer_1.default.diskStorage({
    destination: function (req, _file, cb) {
        let folderPath = '';
        if (!req.body.type)
            return cb(HttpException_utils_1.default.badRequest('choose a file'), '');
        if (!enum_1.MediaType[req.body.type])
            return cb(HttpException_utils_1.default.badRequest('invalid file type'));
        if (env_config_1.DotenvConfig.NODE_ENV === enum_1.Environment.DEVELOPMENT)
            folderPath = path_1.default.join(process.cwd(), 'public', 'uploads', 'temp');
        else
            folderPath = path_1.default.resolve(process.cwd(), 'public', 'uploads', 'temp');
        !fs_1.default.existsSync(folderPath) && fs_1.default.mkdirSync(folderPath, { recursive: true });
        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.' + file.mimetype.split('/').pop();
        cb(null, fileName);
    }
});
const upload = (0, multer_1.default)({
    storage,
});
exports.default = upload;
