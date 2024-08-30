import { IsEmpty, IsString } from 'class-validator'
import {} from 'typeorm'

export class ChatDTO {
  @IsString()
  message: string
}
