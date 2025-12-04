import { IsNotEmpty, IsString, IsInt, IsOptional } from "class-validator";

export class CreateConversationDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  model: string = "gpt-4o";
}