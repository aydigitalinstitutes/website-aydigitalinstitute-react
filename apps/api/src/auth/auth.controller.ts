import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
  })
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.register(dto);
    this.auth.setAuthCookies(res, result);
    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully logged in.',
  })
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.login(dto);
    this.auth.setAuthCookies(res, result);
    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 201, description: 'Access token refreshed.' })
  @Post('refresh')
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = dto.refreshToken ?? req.cookies?.refreshToken;
    const result = await this.auth.refresh(refreshToken);
    this.auth.setAuthCookies(res, result);
    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully logged out.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    await this.auth.logout(refreshToken);
    this.auth.clearAuthCookies(res);
    return {};
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return current user profile.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return { user: req.user };
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated.' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        username: { type: 'string' },
        phoneNumber: { type: 'string' },
        dob: { type: 'string', format: 'date' },
        gender: { type: 'string' },
        avatar: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Req() req: any,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const user = await this.auth.updateProfile(req.user.id, dto, file);
    return { user };
  }

  @ApiOperation({ summary: 'Get user avatar' })
  @ApiResponse({ status: 200, description: 'Return avatar image.' })
  @Get('avatar/:id')
  async getAvatar(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { buffer, mimeType } = await this.auth.getAvatar(id);
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(buffer);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 201, description: 'Password changed.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    await this.auth.changePassword(req.user.id, dto);
    return {};
  }

  @ApiOperation({ summary: 'Google login' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async google() {
    return;
  }

  @ApiOperation({ summary: 'Google login redirect' })
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req: any, @Res() res: Response) {
    const result = await this.auth.oauthLogin(req.user);
    this.auth.setAuthCookies(res, result);
    return res.redirect(this.auth.getOAuthSuccessRedirect());
  }

  @ApiOperation({ summary: 'GitHub login' })
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async github() {
    return;
  }

  @ApiOperation({ summary: 'GitHub login redirect' })
  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  async githubRedirect(@Req() req: any, @Res() res: Response) {
    const result = await this.auth.oauthLogin(req.user);
    this.auth.setAuthCookies(res, result);
    return res.redirect(this.auth.getOAuthSuccessRedirect());
  }
}
