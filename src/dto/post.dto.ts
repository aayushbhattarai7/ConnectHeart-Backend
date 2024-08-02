import { IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { AuthDTO } from './user.dto'

export class PostDTO extends AuthDTO {
  @IsString()
  @IsNotEmpty()
  thought: string

  @IsString()
  feeling: string
}

export class updatePostDTO {
  @IsUUID()
  @IsString()
  id: string

  @IsString()
  @IsNotEmpty()
  thought: string

  @IsString()
  feeling: string
}