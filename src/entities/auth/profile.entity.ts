import { AfterLoad, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Base from "../../entities/base.entity";
import { MediaType } from "../../constant/enum";
import { Auth } from "./auth.entity";
import path from "path";
import fs from "fs";
import { getTempFolderPath, getUploadFolderpath } from "../../utils/path.utils";
import { DotenvConfig } from "../../config/env.config";
@Entity('profile')
class Profile extends Base {
    @Column()
    name: string

    @Column({
        name: 'mimetype'
    })
    mimetype: string

    @Column({ enum: MediaType, type: 'enum' })
    type: MediaType

    @OneToOne(() => Auth, (auth) => auth.profile)
    @JoinColumn({ name: 'auth_id' })
    auth: Auth

    public path: string

    transferProfileToUpload(id: string, type: MediaType): void {
        const TEMP_PATH = path.join(getTempFolderPath(), this.name)
        const UPLOAD_PATH = path.join(getUploadFolderpath(), type.toLowerCase(), this.id.toString())
        !fs.existsSync(UPLOAD_PATH) && fs.mkdirSync(UPLOAD_PATH, { recursive: true })
        fs.renameSync(TEMP_PATH, path.join(UPLOAD_PATH, this.name))
        this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id.toString()}/${this.name}`
        
        console.log("🚀 ~ Profile ~ transferProfileToUpload ~ this.path:", this.path)


    }
    @AfterLoad()
    async loadImagePath(): Promise<void> {
        this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id.toString()}/${this.name}`
    }

}
export default Profile
