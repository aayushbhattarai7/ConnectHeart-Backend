import { Type as CType } from 'class-transformer'
import { IsUUID,IsNotEmpty,Matches,IsEmail, IsString, ValidateNested, IsOptional, IsStrongPassword, IsEnum } from "class-validator";
import { Role } from "../constant/enum";
export class DetailDTO{
    @IsNotEmpty()
    @ValidateNested()
    first_name:string

    @IsOptional()
    @ValidateNested()
    middle_name:string

    @IsNotEmpty()
    @ValidateNested()
    last_name:string


    @IsNotEmpty()
    @IsString()
    phone_number:string

  

}
export class AuthDTO extends DetailDTO{
    @IsNotEmpty()
    @IsEmail()
    email:string

    @IsNotEmpty()
    @IsString()
    username:string


    @IsNotEmpty()
    @IsStrongPassword()
    @IsString()
    password: string
    
    @IsNotEmpty()
    @IsEnum(Role, {message:'Invalid Role'})
    role:Role

    
}

export class UpdateDTO extends DetailDTO {
    @IsNotEmpty()
    @IsUUID()
    id: string

    @IsNotEmpty()
    @IsEmail()
    email:string

    @IsNotEmpty()
    @IsString()
    username:string

    @IsNotEmpty()
    @IsEnum(Role, {message:'Invalid Role'})
    role:Role


}

