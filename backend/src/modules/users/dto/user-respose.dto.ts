import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class UserResponseDto {
  id: number;
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}