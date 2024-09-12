import { IsString } from 'class-validator'

export class ChatDTO {
  @IsString()
  message: string
}
