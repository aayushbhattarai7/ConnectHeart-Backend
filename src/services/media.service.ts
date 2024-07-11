import { existsSync } from "fs";
import path from 'path'
import { AppDataSource } from "../config/database.config";
import { Message } from "../constant/message";
import Media from "../entities/media.entity";
import { getTempFolderPath } from "../utils/path.utils";
import AppError from '../utils/HttpException.utils'

export class MediaService {
    constructor(private readonly mediaRepository = AppDataSource.getRepository(Media)){}
    async uploadFile(data:any):Promise<Media> {
        if(!existsSync(path.join(getTempFolderPath(), data.name))) throw AppError.badRequest('Media Not found')
            const newMedia = this.mediaRepository.create({
        mimeType: data.mimeType,
        name:data.name,
        type:data.type,

})

        await this.mediaRepository.save(newMedia)
        newMedia.transferImageFromTempToUpload(newMedia.id, newMedia.type)
        return newMedia
        }
}