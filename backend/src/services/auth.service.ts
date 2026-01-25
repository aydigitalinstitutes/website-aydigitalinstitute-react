import { prisma } from '../prisma.js';
import bcrypt from 'bcryptjs';
import { TokenService } from './token.service.js';
import { AuthResponse, JWTPayload } from '../types/auth.types.js';

export class AuthService {
  static async loginWithOAuth(data: {
    provider: 'GOOGLE' | 'GITHUB';
    providerId: string;
    email: string;
    name: string;
    avatar?: string;
  }): Promise<AuthResponse> {
    const existingByEmail = await prisma.user.findUnique({ where: { email: data.email } });

    const user = await prisma.user.upsert({
      where: { email: data.email },
      create: {
        name: data.name,
        email: data.email,
        provider: data.provider,
        providerId: data.providerId,
        avatar: data.avatar,
        isEmailVerified: true,
        isActive: true,
      },
      update: {
        name: existingByEmail?.name || data.name,
        provider: data.provider,
        providerId: data.providerId,
        avatar: data.avatar,
        isEmailVerified: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user.isActive) {
      return {
        success: false,
        message: 'Account is deactivated. Please contact support.',
      };
    }

    const tokens = await TokenService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role as 'STUDENT' | 'ADMIN',
    });

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  }

  /**
   * Register new user
   */
  static async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    courseInterested?: string;
  }): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return {
          success: false,
          message: 'User already exists with this email',
        };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // Create user
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
          courseInterested: data.courseInterested,
          provider: 'LOCAL',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isEmailVerified: true,
        },
      });

      // Generate tokens
      const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role as 'STUDENT' | 'ADMIN',
      };

      const tokens = await TokenService.generateTokenPair(payload);

      return {
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        tokens,
      };
    } catch (error: any) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Special admin login
      if (email === 'admin' && password === 'admin123') {
        let adminUser = await prisma.user.findUnique({
          where: { email: 'admin@aydigital.com' },
        });

        if (!adminUser) {
          // Create admin user if not exists
          adminUser = await prisma.user.create({
            data: {
              name: 'Admin',
              email: 'admin@aydigital.com',
              password: await bcrypt.hash('admin123', 10),
              role: 'ADMIN',
              isEmailVerified: true,
              isActive: true,
            },
          });
        }

        // Generate tokens
        const tokens = await TokenService.generateTokenPair({
          userId: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        });

        return {
          success: true,
          message: 'Login successful',
          user: {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
          },
          ...tokens,
        };
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          message: 'Account is deactivated. Please contact support.',
        };
      }

      // Verify password (only for LOCAL provider)
      if (user.provider === 'LOCAL' && user.password) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return {
            success: false,
            message: 'Invalid email or password',
          };
        }
      } else if (user.provider !== 'LOCAL') {
        return {
          success: false,
          message: `Please login using ${user.provider} authentication`,
        };
      }

      // Generate tokens
      const payload: JWTPayload = {
        userId: user.id,
        email: user.email,
        role: user.role as 'STUDENT' | 'ADMIN',
      };

      const tokens = await TokenService.generateTokenPair(payload);

      return {
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        tokens,
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<{
    success: boolean;
    accessToken?: string;
    message?: string;
  }> {
    try {
      const userData = await TokenService.verifyAndRotateRefreshToken(refreshToken);

      if (!userData) {
        return {
          success: false,
          message: 'Invalid or expired refresh token',
        };
      }

      // Generate new access token
      const payload: JWTPayload = {
        userId: userData.userId,
        email: userData.email,
        role: userData.role as 'STUDENT' | 'ADMIN',
      };

      const accessToken = TokenService.generateAccessToken(payload);

      // Generate new refresh token (rotation)
      const newRefreshToken = await TokenService.generateRefreshToken(userData.userId);

      return {
        success: true,
        accessToken,
        // Note: newRefreshToken should be sent via cookie
      };
    } catch (error: any) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        message: 'Token refresh failed',
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(refreshToken: string): Promise<{ success: boolean; message: string }> {
    try {
      await TokenService.revokeRefreshToken(refreshToken);
      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error: any) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Logout failed',
      };
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: number) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        courseInterested: true,
        isEmailVerified: true,
        isActive: true,
        createdAt: true,
      },
    });
  }
}
