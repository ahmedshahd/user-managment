import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
        },
      });
      return createdUser;
    } catch (error) {
      console.log('error', error);
      if (error.code === 'P2002') {
        // Prisma error with code P2002 indicates a unique constraint violation
        throw new ConflictException(
          `User with phone number ${createUserDto.phoneNumber} already exists.`,
        );
      }

      throw error;
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({});
      return users;
    } catch (error) {}
  }

  async findOne(id: number) {
    try {
      console.log('id', id);
      const user = await this.prisma.user.findFirst({
        where: {
          id,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
        },
      });

      return updatedUser;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        // Prisma error with code P2025 indicates that the record was not found
        throw new NotFoundException('User not found');
      }
      throw error; // Rethrow other errors
    }
  }

  async remove(id: number) {
    try {
      const removedUser = await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return removedUser;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        // Prisma error with code P2025 indicates that the record was not found
        throw new NotFoundException('User not found');
      }
      throw error; // Rethrow other errors
    }
  }
}
