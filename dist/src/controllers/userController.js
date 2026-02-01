import { findUserById, toPublicUser, listUsers, deactivateUser } from '../services/userService.js';
// GET /api/v1/users (admin only)
export async function getUsers(req, res, next) {
    try {
        const requester = req.user;
        if (!requester)
            return res.status(401).json({ error: 'Unauthorized' });
        if (requester.role !== 'admin')
            return res.status(403).json({ error: 'Forbidden' });
        const pageParam = Number.parseInt(String(req.query.page), 10);
        const limitParam = Number.parseInt(String(req.query.limit), 10);
        const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
        const limit = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 100 ? limitParam : 20;
        const offset = (page - 1) * limit;
        const { rows, count } = await listUsers({ offset, limit });
        const items = rows.map(toPublicUser);
        const pages = Math.ceil(count / limit) || 1;
        return res.json({ items, total: count, page, limit, pages });
    }
    catch (err) {
        next(err);
    }
}
// GET /api/v1/users/:id (protected)
// Can be accessed by admin or the user themselves
export async function getUserById(req, res, next) {
    try {
        const { id } = req.params;
        const requester = req.user; // set by auth middleware
        if (!requester) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const isAdmin = requester.role === 'admin';
        const isSelf = requester.id === id;
        if (!isAdmin && !isSelf) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const user = await findUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(toPublicUser(user));
    }
    catch (err) {
        next(err);
    }
}
// POST /api/v1/users/:id/block (protected)
// Can be performed by admin or the user themselves
export async function blockUser(req, res, next) {
    try {
        const { id } = req.params;
        const requester = req.user;
        if (!requester) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const isAdmin = requester.role === 'admin';
        const isSelf = requester.id === id;
        if (!isAdmin && !isSelf) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const user = await findUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!user.isActive) {
            // Idempotent: already blocked
            return res.status(200).json({ message: 'User already blocked', user: toPublicUser(user) });
        }
        const updated = await deactivateUser(id);
        return res.status(200).json({ message: 'User blocked successfully', user: toPublicUser(updated) });
    }
    catch (err) {
        next(err);
    }
}
