import {
  IsUUID,
  IsNotEmpty,
  Matches,
  IsEmail,
  IsString,
  ValidateNested,
  IsOptional,
  IsStrongPassword,
  IsEnum,
  IsEmpty,
  isNotEmpty,
  isString,
} from 'class-validator'
import { Role } from '../constant/enum'
export class DetailDTO {
  @IsNotEmpty()
  first_name: string

  @IsOptional()
  middle_name: string

  @IsNotEmpty()
  last_name: string

  @IsNotEmpty()
  @IsString()
  phone_number: string

  
}
export class AuthDTO extends DetailDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsEnum(Role, { message: 'Invalid Role' })
  role: Role = Role.USER
  
 
}

export class UpdateDTO extends DetailDTO {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsEnum(Role, { message: 'Invalid Role' })
  role: Role
}
export class GoogleLoginDTO {
  @IsNotEmpty()
  @IsString()
  googleId:string
}

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password:string
}