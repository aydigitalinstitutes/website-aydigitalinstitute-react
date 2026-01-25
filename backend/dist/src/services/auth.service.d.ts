import { AuthResponse } from '../types/auth.types.js';
export declare class AuthService {
    /**
     * Register new user
     */
    static register(data: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        courseInterested?: string;
    }): Promise<AuthResponse>;
    /**
     * Login user
     */
    static login(email: string, password: string): Promise<AuthResponse>;
    /**
     * Refresh access token
     */
    static refreshToken(refreshToken: string): Promise<{
        success: boolean;
        accessToken?: string;
        message?: string;
    }>;
    /**
     * Logout user
     */
    static logout(refreshToken: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Get user by ID
     */
    static getUserById(userId: number): Promise<{
        createdAt: Date;
        id: number;
        name: string;
        email: string;
        role: import("../../generated/prisma/index.js").$Enums.Role;
        phone: string | null;
        courseInterested: string | null;
        isEmailVerified: boolean;
        isActive: boolean;
    } | null>;
}
//# sourceMappingURL=auth.service.d.ts.map