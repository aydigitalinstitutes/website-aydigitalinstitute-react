import { PrismaClient } from '../../generated/prisma/index.js';
import bcrypt from 'bcryptjs';
import { TokenService } from './token.service.js';
const prisma = new PrismaClient();
export class AuthService {
    /**
     * Register new user
     */
    static async register(data) {
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
            const payload = {
                userId: user.id,
                email: user.email,
                role: user.role,
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
        }
        catch (error) {
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
    static async login(email, password) {
        try {
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
            }
            else if (user.provider !== 'LOCAL') {
                return {
                    success: false,
                    message: `Please login using ${user.provider} authentication`,
                };
            }
            // Generate tokens
            const payload = {
                userId: user.id,
                email: user.email,
                role: user.role,
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
        }
        catch (error) {
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
    static async refreshToken(refreshToken) {
        try {
            const userData = await TokenService.verifyAndRotateRefreshToken(refreshToken);
            if (!userData) {
                return {
                    success: false,
                    message: 'Invalid or expired refresh token',
                };
            }
            // Generate new access token
            const payload = {
                userId: userData.userId,
                email: userData.email,
                role: userData.role,
            };
            const accessToken = TokenService.generateAccessToken(payload);
            // Generate new refresh token (rotation)
            const newRefreshToken = await TokenService.generateRefreshToken(userData.userId);
            return {
                success: true,
                accessToken,
                // Note: newRefreshToken should be sent via cookie
            };
        }
        catch (error) {
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
    static async logout(refreshToken) {
        try {
            await TokenService.revokeRefreshToken(refreshToken);
            return {
                success: true,
                message: 'Logged out successfully',
            };
        }
        catch (error) {
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
    static async getUserById(userId) {
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
//# sourceMappingURL=auth.service.js.map