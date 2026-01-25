import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma/index.js';
import crypto from 'crypto';
const prisma = new PrismaClient();
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';
export class TokenService {
    /**
     * Generate access token
     */
    static generateAccessToken(payload) {
        // @ts-ignore
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });
    }
    /**
     * Generate refresh token (random string stored in DB)
     */
    static async generateRefreshToken(userId) {
        // Generate random token
        const token = crypto.randomBytes(40).toString('hex');
        // Calculate expiry (7 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        // Store in database
        await prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        });
        return token;
    }
    /**
     * Generate both tokens
     */
    static async generateTokenPair(payload) {
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = await this.generateRefreshToken(payload.userId);
        return { accessToken, refreshToken };
    }
    /**
     * Verify access token
     */
    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, ACCESS_TOKEN_SECRET);
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Verify and rotate refresh token
     */
    static async verifyAndRotateRefreshToken(token) {
        // Find token in database
        const refreshTokenRecord = await prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!refreshTokenRecord) {
            return null;
        }
        // Check if expired
        if (refreshTokenRecord.expiresAt < new Date()) {
            // Delete expired token
            await prisma.refreshToken.delete({
                where: { id: refreshTokenRecord.id },
            });
            return null;
        }
        // Delete old token (rotation)
        await prisma.refreshToken.delete({
            where: { id: refreshTokenRecord.id },
        });
        // Return user info for new token generation
        return {
            userId: refreshTokenRecord.user.id,
            email: refreshTokenRecord.user.email,
            role: refreshTokenRecord.user.role,
        };
    }
    /**
     * Revoke refresh token
     */
    static async revokeRefreshToken(token) {
        await prisma.refreshToken.deleteMany({
            where: { token },
        });
    }
    /**
     * Revoke all user refresh tokens
     */
    static async revokeAllUserTokens(userId) {
        await prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }
    /**
     * Clean up expired tokens
     */
    static async cleanupExpiredTokens() {
        await prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
}
//# sourceMappingURL=token.service.js.map