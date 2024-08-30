'use strict'
// import fs from 'fs'
// import path from 'path'
// import {AfterLoad,Column, Entity, JoinColumn, ManyToOne} from 'typeorm'
// import Base from '../base.entity'
// import { MediaType } from '../../constant/enum'
// import { Post } from './posts.entity'
// import { getTempFolderPathForPost, getUploadFolderpathForPost } from '../../utils/path.utils'
// import {DotenvConfig} from '../../config/env.config'
// @Entity('post')
// export class PostMedia extends Base {
//     @Column({
//         name: 'mime_type',
//         nullable:true
//       })
//       mimeType: string
//     @Column({enum:MediaType, type:'enum', nullable:true})
//     type:MediaType
//     @ManyToOne(() => Post, (posts) => posts.postImage)
//     @JoinColumn({name:'post_id'})
//     posts:Post
//     public path : string
//     transferImageFromTempToUpload(id:string, type:MediaType): void{
//         const TEMP_PATH = path.join(getTempFolderPathForPost())
//         const UPLOAD_PATH = path.join(getUploadFolderpathForPost(), type.toLowerCase(), id.toString())
//         !fs.existsSync(UPLOAD_PATH) && fs.mkdirSync(UPLOAD_PATH, {recursive:true})
//         fs.renameSync(TEMP_PATH, path.join(UPLOAD_PATH))
//     }
//     @AfterLoad()
//     async loadImagePath(): Promise<void>{
//         this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}`
//     }
// }
