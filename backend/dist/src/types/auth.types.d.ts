export interface JWTPayload {
    userId: number;
    email: string;
    role: 'STUDENT' | 'ADMIN';
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export interface AuthResponse {
    success: boolean;
    message: string;
    user?: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    tokens?: TokenPair;
}
export interface RefreshTokenResponse {
    success: boolean;
    accessToken?: string;
    message?: string;
}
//# sourceMappingURL=auth.types.d.ts.map