import express, { Express } from 'express';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

export function createApp(): Express {
  const app = express();
  app.use(express.json({ limit: '64kb' }));
  app.use(routes);

  app.use(errorHandler);

  return app;
}
