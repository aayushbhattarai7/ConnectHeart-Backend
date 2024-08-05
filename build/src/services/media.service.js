"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const database_config_1 = require("../config/database.config");
const media_entity_1 = __importDefault(require("../entities/media.entity"));
const path_utils_1 = require("../utils/path.utils");
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
class MediaService {
    mediaRepository;
    constructor(mediaRepository = database_config_1.AppDataSource.getRepository(media_entity_1.default)) {
        this.mediaRepository = mediaRepository;
    }
    async uploadFile(data) {
        if (!(0, fs_1.existsSync)(path_1.default.join((0, path_utils_1.getTempFolderPath)(), data.name)))
            throw HttpException_utils_1.default.badRequest('Media Not found');
        const newMedia = this.mediaRepository.create({
            mimeType: data.mimeType,
            name: data.name,
            type: data.type,
        });
        await this.mediaRepository.save(newMedia);
        newMedia.transferImageFromTempToUpload(newMedia.id, newMedia.type);
        return newMedia;
    }
}
exports.MediaService = MediaService;
