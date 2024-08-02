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
  @Column({})
  name: string

  @Column({
    name: 'mimetype',
  })
  mimetype: string

  @Column({ enum: MediaType, type: 'enum' })
  type: MediaType

  @ManyToOne(() => Post, (posts) => posts.postImage)
  @JoinColumn({ name: 'post_id' })
  posts: Post

  public path: string

  transferImageFromTempToUpload(id: string, type: MediaType): void {
    const post_id = this.posts.id
    console.log(post_id,"Post ko id postid")
    const TEMP_PATH = path.join(getTempFolderPathForPost(), this.name)
    const UPLOAD_PATH = path.join(getUploadFolderpathForPost(), type.toLowerCase(), this.id.toString())
    !fs.existsSync(UPLOAD_PATH) && fs.mkdirSync(UPLOAD_PATH, { recursive: true })
    fs.renameSync(TEMP_PATH, path.join(UPLOAD_PATH, this.name))
    this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id.toString()}/${this.name}`
console.log(this.path)
    
  }

  // transferImageFromUploadToTemp(id: string, type: MediaType): void {
  //   const post_id = this.posts.id
  //   const TEMP_PATH = path.join(getTempFolderPathForPost(), post_id.toString())


  //   console.log('🚀 ~ PostMedia ~ transferImageFromUploadToTemp ~ TEMP_PATH:', TEMP_PATH)

  //   const UPLOAD_PATH = path.join(getUploadFolderpathForPost(), type.toLowerCase(), post_id.toString())
  //   console.log('🚀 ~ PostMedia ~ transferImageFromUploadToTemp ~ UPLOAD_PATH:', UPLOAD_PATH)

  //   try {
  //     const parentTempPath = path.dirname(TEMP_PATH)
  //     console.log('🚀 ~ PostMedia ~ transferImageFromUploadToTemp ~ parentTempPath:', parentTempPath)

  //     if (fs.existsSync(parentTempPath)) {
  //       // rmSync(TEMP_PATH, { recursive: true, force: true })
  //     } else {
  //       fs.mkdirSync(parentTempPath, { recursive: true })
  //     }

  //     fs.rmdirSync(UPLOAD_PATH)
  //   } catch (err) {
  //     console.error('Error moving directory:', err)
  //   }
  // }

  @AfterLoad()
  async loadImagePath(): Promise<void> {
    this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id.toString()}/${this.name}`
  }
}
export default PostMedia
