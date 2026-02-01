import type { Request, Response } from 'express';
import { sequelize } from '../db/sequelize.js';

export async function health(_req: Request, res: Response) {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', db: 'up', time: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'down', time: new Date().toISOString() });
  }
}
