import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.services";
import * as bcrypt from 'bcrypt';
import {JwtService } from '@nestjs/jwt';
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.createUser(registerDto);
    return user;
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