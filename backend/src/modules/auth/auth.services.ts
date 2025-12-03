import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from "@nestjs/common";
import { UsersService } from "../users/users.services";
import * as bcrypt from 'bcrypt';
import {JwtService } from '@nestjs/jwt';
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    try {
      // 檢查 email 是否已存在
      const existingUser = await this.usersService.findEmail(registerDto.email);
      if (existingUser) {
        throw new ConflictException('此電子郵件已被註冊');
      }

      const user = await this.usersService.createUser(registerDto);
      // createUser 已經返回不包含 password 的 UserResponseDto
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('此電子郵件已被註冊');
        }
      }
      console.error('註冊錯誤:', error);
      throw new BadRequestException('註冊失敗，請稍後再試');
    }
  }
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong password');
    }
    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    return {access_token: token};
  }
}