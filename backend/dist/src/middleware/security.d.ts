import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
export declare const corsOptions: (req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
export declare const securityHeaders: (req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const authRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const apiRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const rateLimitHandler: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=security.d.ts.map