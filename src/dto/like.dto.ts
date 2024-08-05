import { IsNumber, IsNumberString, IsString } from "class-validator";
import { AuthDTO } from "./user.dto";

export class LikeDTO extends AuthDTO {
    @IsString()
    like: string
}