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

  @IsNotEmpty()
  last_name: string

  @IsString()
  phone_number: string

  @IsNotEmpty()
  @IsString()
  gender: string


}
export class AuthDTO extends DetailDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string


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
  @IsEnum(Role, { message: 'Invalid Role' })
  role: Role
}
export class GoogleLoginDTO {
  @IsNotEmpty()
  @IsString()
  googleId: string
}

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string
}