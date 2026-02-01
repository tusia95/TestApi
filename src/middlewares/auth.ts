import type { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.js';
import { findUserById, toPublicUser } from '../services/userService.js';

// Парсим  Bearer <token> получает юзера из БД по токену and добавляем данные юзера к request
export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = (req.headers['authorization'] || req.headers['Authorization']) as string | undefined;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.slice('Bearer '.length).trim();
    let payload;
    try {
      payload = verifyJwt(token);
    } catch (e) {
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
    // в данные request добавляем публичные данные юзера и токен
    req.user = toPublicUser(user);
    req.tokenPayload = payload;
    next();
  } catch (err) {
    next(err);
  }
}

// проверка требуемой роли у пользователя
export function requireRole(role: 'admin' | 'user') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
