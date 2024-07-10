import fs from 'fs'
import path from 'path'
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { DotenvConfig } from '../config/env.config'
import { userDetails } from './auth/details.entities'
import { MediaType } from '../constant/enum'
import { getTempFolderPath, getUploadFolderpath } from '../utils/path.utils'
import Base from './base.entity'

@Entity('media')
class Media extends Base {
    @Column({nullable:true})
    name:string

    @Column({
        name:"mimi_type"
    })
    mimeType:string

    @Column({ enum:MediaType, type:'enum'})
    type:MediaType

    @ManyToOne(()=>userDetails, (auth) =>auth.profileImage)
    @JoinColumn({name:"auth_id"})
    details:userDetails


    public path : string
    transferImageFromTempToUpload(id:string, type:MediaType): void{
        const TEMP_PATH = path.join(getTempFolderPath(), this.name)
        const UPLOAD_PATH = path.join(getUploadFolderpath(), type.toLowerCase(), id.toString())

        !fs.existsSync(UPLOAD_PATH) && fs.mkdirSync(UPLOAD_PATH, {recursive:true})
        fs.renameSync(TEMP_PATH, path.join(UPLOAD_PATH, this.name))
    }

    @AfterLoad()
    async loadImagePath(): Promise<void>{
        this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.name}`

    }
}   


export default Media