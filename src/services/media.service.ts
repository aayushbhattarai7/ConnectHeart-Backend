import { existsSync } from 'fs'
import path from 'path'
import { AppDataSource } from '../config/database.config'
import { Message } from '../constant/message'
import PostMedia from '../entities/posts/postMedia.entity'
import { getTempFolderPath } from '../utils/path.utils'
import HttpException from '../utils/HttpException.utils'

export class MediaService {
  constructor(private readonly mediaRepository = AppDataSource.getRepository(PostMedia)) {}
  async uploadFile(data: any): Promise<PostMedia> {
    if (!existsSync(path.join(getTempFolderPath(), data.name))) throw HttpException.badRequest('Media Not found')
    const newMedia = this.mediaRepository.create({
      // mimeType: data.mimeType,
      type: data.type,
    })

    await this.mediaRepository.save(newMedia)
    newMedia.transferImageFromTempToUpload(newMedia.id, newMedia.type)
    return newMedia
  }
}
