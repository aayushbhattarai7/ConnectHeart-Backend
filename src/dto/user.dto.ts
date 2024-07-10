import { IsNotEmpty,Matches,IsEmail, IsString, ValidateNested, IsOptional, IsStrongPassword } from "class-validator";
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
    @IsString()
    @IsStrongPassword()
    password:string
}