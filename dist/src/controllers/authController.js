import { isValidEmail, normalizeEmail, validateBirthDate } from '../utils/validation.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { findUserByEmail, createUser, toPublicUser } from '../services/userService.js';
import { signJwt } from '../utils/jwt.js';
// POST /api/v1/auth/register
export async function register(req, res, next) {
    try {
        const { fullName, birthDate, email, password } = (req.body || {});
        let { role = 'user', isActive = true } = (req.body || {});
        // Validate required fields
        if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
            return res.status(400).json({ error: 'fullName is required and must be at least 2 characters' });
        }
        const bd = validateBirthDate(String(birthDate));
        if (!bd.ok)
            return res.status(400).json({ error: bd.msg });
        if (!email || typeof email !== 'string' || !isValidEmail(email)) {
            return res.status(400).json({ error: 'email is required and must be valid' });
        }
        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ error: 'password is required and must be at least 6 characters' });
        }
        // Проверка корректности названия роли
        role = String(role).toLowerCase();
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ error: "role must be either 'admin' or 'user'" });
        }
        isActive = Boolean(isActive);
        // Unique email check (case-insensitive normalization already lowercases)
        const normEmail = normalizeEmail(email);
        const existing = await findUserByEmail(normEmail);
        if (existing) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }
        const { hash, salt } = hashPassword(password);
        const created = await createUser({
            fullName: String(fullName).trim(),
            birthDate: bd.date,
            email: normEmail,
            passwordHash: hash,
            salt,
            role,
            isActive,
        });
        return res.status(201).json(toPublicUser(created));
    }
    catch (err) {
        next(err);
    }
}
// POST /api/v1/auth/login
export async function login(req, res, next) {
    try {
        const { email, password } = (req.body || {});
        if (!email || typeof email !== 'string' || !isValidEmail(email)) {
            return res.status(400).json({ error: 'email is required and must be valid' });
        }
        if (!password || typeof password !== 'string') {
            return res.status(400).json({ error: 'password is required' });
        }
        const normEmail = normalizeEmail(email);
        const user = await findUserByEmail(normEmail);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const ok = verifyPassword(password, user.salt, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        if (!user.isActive) {
            return res.status(403).json({ error: 'User is inactive' });
        }
        const token = signJwt({ sub: user.id, role: user.role, email: user.email });
        return res.json({ token, user: toPublicUser(user) });
    }
    catch (err) {
        next(err);
    }
}
