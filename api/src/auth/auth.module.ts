import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from './repositories/users.repository';
import { RefreshTokensRepository } from './repositories/refresh-tokens.repository';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [PassportModule.register({ session: false }), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersRepository,
    RefreshTokensRepository,
    JwtAccessStrategy,
    GoogleStrategy,
    GitHubStrategy,
    RolesGuard,
  ],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}

