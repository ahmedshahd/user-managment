import { PrismaService } from './../prisma/prisma.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await argon.hash(dto.password);
    try {
      const newAdmin = await this.prisma.admin.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      const tokens = await this.getTokens(newAdmin.id, newAdmin.email);
      await this.updateRtHash(newAdmin.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${dto.email} already exists.`);
      }
      throw error;
    }
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const admin = await this.prisma.admin.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!admin)
      throw new ForbiddenException('Access Denied, you are not a admin ');
    const passwordMatches = await argon.verify(admin.hash, dto.password);
    if (!passwordMatches)
      throw new ForbiddenException('Access Denied, incorrect password ');
    const tokens = await this.getTokens(admin.id, admin.email);
    await this.updateRtHash(admin.id, tokens.refresh_token);
    return tokens;
  }

  async refreshTokens(adminId: number, rt: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin || !admin.hashRt) throw new ForbiddenException('Access Denied');
    const rtMatches = await argon.verify(admin.hashRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(admin.id, admin.email);
    await this.updateRtHash(admin.id, tokens.refresh_token);

    return tokens;
  }

  async logout(adminId: number) {
    return await this.prisma.admin.updateMany({
      where: {
        id: adminId,
        hashRt: {
          not: null,
        },
      },
      data: {
        hashRt: null,
      },
    });
  }

  async getTokens(adminId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: adminId,
          email,
        },
        {
          expiresIn: 60 * 15,
          secret: 'at-secret',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: adminId,
          email,
        },
        {
          expiresIn: 60 * 60 * 25 * 7,
          secret: 'rt-secret',
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(adminId: number, rt: string) {
    const hash = await argon.hash(rt);
   return  this.prisma.admin.update({
      where: {
        id: adminId,
      },
      data: {
        hashRt: hash,
      },
    });
  }
}
