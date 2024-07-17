import { Type as CType } from 'class-transformer'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { MediaType } from 'express'
import { AuthDTO } from './user.dto'

export class PostDTO extends AuthDTO{
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
