import { GetCurrentAdmin, GetCurrentAdminId, Public } from './common/decorators';
import { RtGuard } from './common/guards/rt.guard';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('admins') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Admin account' })
  @ApiBody({ type: AuthDto })
  signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with a local account' })
  @ApiBody({ type: AuthDto })
  signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout from the application' })
  @ApiResponse({ status: 200 })
  logout(@GetCurrentAdminId() adminId: number) {
    return this.authService.logout(adminId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens for an authenticated Admin' })
  @ApiBody({ type: AuthDto })
  refreshTokens(
    @GetCurrentAdminId() adminId: number,
    @GetCurrentAdmin('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(adminId, refreshToken);
  }
}
