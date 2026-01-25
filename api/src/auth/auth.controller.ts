import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.register(dto);
    this.auth.setAuthCookies(res, result);
    return { success: true, user: result.user };
  }

  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.login(dto);
    this.auth.setAuthCookies(res, result);
    return { success: true, user: result.user };
  }

  @Post('refresh')
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = dto.refreshToken ?? req.cookies?.refreshToken;
    const result = await this.auth.refresh(refreshToken);
    this.auth.setAuthCookies(res, result);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    await this.auth.logout(refreshToken);
    this.auth.clearAuthCookies(res);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return { success: true, user: req.user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async google() {
    return;
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req: any, @Res() res: Response) {
    const result = await this.auth.oauthLogin(req.user);
    this.auth.setAuthCookies(res, result);
    return res.redirect(this.auth.getOAuthSuccessRedirect());
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async github() {
    return;
  }

  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  async githubRedirect(@Req() req: any, @Res() res: Response) {
    const result = await this.auth.oauthLogin(req.user);
    this.auth.setAuthCookies(res, result);
    return res.redirect(this.auth.getOAuthSuccessRedirect());
  }
}
