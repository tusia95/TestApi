import { verifyJwt } from '../utils/jwt.js';
import { findUserById, toPublicUser } from '../services/userService.js';
// Parses Authorization: Bearer <token>, verifies JWT, loads user and attaches to req
export async function auth(req, res, next) {
    try {
        const authHeader = (req.headers['authorization'] || req.headers['Authorization']);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid Authorization header' });
        }
        const token = authHeader.slice('Bearer '.length).trim();
        let payload;
        try {
            payload = verifyJwt(token);
        }
        catch (e) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        if (!payload || !payload.sub) {
            return res.status(401).json({ error: 'Invalid token payload' });
        }
        const user = await findUserById(payload.sub);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        if (!user.isActive) {
            return res.status(403).json({ error: 'User is inactive' });
        }
        // attach user and token payload
        req.user = toPublicUser(user);
        req.tokenPayload = payload;
        next();
    }
    catch (err) {
        next(err);
    }
}
// Optional role guard
export function requireRole(role) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        if (req.user.role !== role)
            return res.status(403).json({ error: 'Forbidden' });
        next();
    };
}
