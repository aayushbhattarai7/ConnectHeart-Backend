import { IsEmpty, IsString } from 'class-validator'
import { AuthDTO } from './user.dto'
import {  } from 'typeorm'

export class CommentDTO {
  @IsString()
  comment: string

  @IsEmpty()
  parentId: string
}
