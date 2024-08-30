import fs, { rmSync } from 'fs'
import path from 'path'
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import Base from '../base.entity'
import { MediaType } from '../../constant/enum'
import { Chat } from './chat.entity'
import { getTempFolderPathForChat, getUploadFolderpathForChat } from '../../utils/path.utils'
import { DotenvConfig } from '../../config/env.config'

@Entity('postimage')
class ChatMedia extends Base {
  @Column({})
  name: string

  @Column({
    name: 'mimetype',
  })
  mimetype: string

  @Column({ enum: MediaType, type: 'enum' })
  type: MediaType

  @ManyToOne(() => Chat, (chats) => chats.chatMedia)
  @JoinColumn({ name: 'chat_id' })
  chats: Chat

  public path: string

  transferImageFromTempToUpload(id: string, type: MediaType): void {
    const TEMP_PATH = path.join(getTempFolderPathForChat(), this.name)
    const UPLOAD_PATH = path.join(getUploadFolderpathForChat(), type.toLowerCase(), this.id.toString())
    !fs.existsSync(UPLOAD_PATH) && fs.mkdirSync(UPLOAD_PATH, { recursive: true })
    fs.renameSync(TEMP_PATH, path.join(UPLOAD_PATH, this.name))
    this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id.toString()}/${this.name}`
    console.log(this.path)
  }

  @AfterLoad()
  async loadImagePath(): Promise<void> {
    this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id.toString()}/${this.name}`
  }
}
export default ChatMedia
