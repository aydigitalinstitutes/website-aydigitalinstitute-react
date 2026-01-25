import { TokenService } from '../services/token.service.js';
/**
 * Middleware to authenticate JWT tokens
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header or cookie
        let token;
        // Check Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
        // Check cookie
        else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }
        // Verify token
        const payload = TokenService.verifyAccessToken(token);
        if (!payload) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
            return;
        }
        // Attach user to request
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
        });
    }
};
/**
 * Middleware to check user role
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Insufficient permissions',
            });
            return;
        }
        next();
    };
};
//# sourceMappingURL=auth.middleware.js.map