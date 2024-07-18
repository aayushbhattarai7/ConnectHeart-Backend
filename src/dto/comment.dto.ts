import { IsString } from "class-validator";
import { AuthDTO } from "./user.dto";

export class CommentDTO extends AuthDTO {
    @IsString()
    comment:string

    @IsString()
    parentId: string
}