import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user-dto";
import { UserResponseDto } from "./dto/user-respose.dto";
import { hashPassword } from "../../common/utils/hash.util";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async findEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(user: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await hashPassword(user.password);
    return this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
      },
    });
  }
}