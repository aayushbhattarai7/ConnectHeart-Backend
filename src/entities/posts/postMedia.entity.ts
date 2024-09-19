import fs, { rmSync } from 'fs'
import path from 'path'
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import Base from '../base.entity'
import { MediaType } from '../../constant/enum'
import { Post } from './posts.entity'
import { getTempFolderPathForPost, getUploadFolderpathForPost } from '../../utils/path.utils'
import { DotenvConfig } from '../../config/env.config'

@Entity('postimage')
class PostMedia extends Base {
  @Column()
  name: string

  @Column({
    name: 'mimetype',
  })
  mimetype: string

  @Column({ enum: MediaType, type: 'enum' })
  type: MediaType

  @ManyToOne(() => Post, (posts) => posts.postImage, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  posts: Post

  public path: string

  transferImageFromTempToUpload(id: string, type: MediaType): void {
    const post_id = this.posts.id
    const TEMP_PATH = path.join(getTempFolderPathForPost(), this.name)
    const UPLOAD_PATH = path.join(getUploadFolderpathForPost(), type.toLowerCase(), this.id.toString())
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
export default PostMedia
