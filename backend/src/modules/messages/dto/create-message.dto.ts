import { IsNotEmpty, IsString, IsInt, IsEnum, IsOptional } from "class-validator";
import  {MessageRole} from "@prisma/client";
export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsInt()
  conversationId: number;

  @IsNotEmpty()
  @IsEnum(MessageRole)
  role: MessageRole;

  @IsInt()
  tokens?: number;
}