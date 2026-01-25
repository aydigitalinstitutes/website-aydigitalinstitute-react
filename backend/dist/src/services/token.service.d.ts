import { JWTPayload, TokenPair } from '../types/auth.types.js';
export declare class TokenService {
    /**
     * Generate access token
     */
    static generateAccessToken(payload: JWTPayload): string;
    /**
     * Generate refresh token (random string stored in DB)
     */
    static generateRefreshToken(userId: number): Promise<string>;
    /**
     * Generate both tokens
     */
    static generateTokenPair(payload: JWTPayload): Promise<TokenPair>;
    /**
     * Verify access token
     */
    static verifyAccessToken(token: string): JWTPayload | null;
    /**
     * Verify and rotate refresh token
     */
    static verifyAndRotateRefreshToken(token: string): Promise<{
        userId: number;
        email: string;
        role: string;
    } | null>;
    /**
     * Revoke refresh token
     */
    static revokeRefreshToken(token: string): Promise<void>;
    /**
     * Revoke all user refresh tokens
     */
    static revokeAllUserTokens(userId: number): Promise<void>;
    /**
     * Clean up expired tokens
     */
    static cleanupExpiredTokens(): Promise<void>;
}
//# sourceMappingURL=token.service.d.ts.map