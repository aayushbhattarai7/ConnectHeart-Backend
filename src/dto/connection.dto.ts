import { IsNotEmpty, IsEnum } from "class-validator";
import { Status } from "../constant/enum";
import { AuthDTO } from "./user.dto";

export class ConnectDTO extends AuthDTO{
    @IsNotEmpty()
    @IsEnum(Status, { message: 'Invalid Role' })
    status: Status = Status.PENDING
    
}
